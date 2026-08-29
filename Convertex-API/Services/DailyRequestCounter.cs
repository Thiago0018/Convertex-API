using StackExchange.Redis;

namespace MeuProjetoVision.Services;

public interface IDailyRequestCounter
{
    Task<bool> TryConsumeAsync();
}

public sealed class DailyRequestCounter : IDailyRequestCounter
{
    private readonly object _lock = new();
    private readonly int _dailyLimit;
    private readonly int _reservedRequests;
    private DateOnly _date = DateOnly.FromDateTime(DateTime.UtcNow);
    private int _consumedRequests;

    public DailyRequestCounter(IConfiguration configuration)
    {
        _dailyLimit = configuration.GetValue("Ocr:DailyRequestLimit", 1000);
        _reservedRequests = configuration.GetValue("Ocr:ReservedRequests", 100);

        if (_dailyLimit <= 0)
            throw new InvalidOperationException("Ocr:DailyRequestLimit deve ser maior que zero.");

        if (_reservedRequests < 0 || _reservedRequests >= _dailyLimit)
            throw new InvalidOperationException("Ocr:ReservedRequests deve ser maior ou igual a zero e menor que Ocr:DailyRequestLimit.");
    }

    public Task<bool> TryConsumeAsync()
    {
        lock (_lock)
        {
            DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);
            if (today != _date)
            {
                _date = today;
                _consumedRequests = 0;
            }

            int maximumAllowedRequests = _dailyLimit - _reservedRequests;
            if (_consumedRequests >= maximumAllowedRequests)
                return Task.FromResult(false);

            _consumedRequests++;
            return Task.FromResult(true);
        }
    }
}

public sealed class RedisDailyRequestCounter : IDailyRequestCounter
{
    private const string ConsumeScript = """
        local current = redis.call('INCR', KEYS[1])
        if current == 1 then redis.call('EXPIRE', KEYS[1], ARGV[2]) end
        if current > tonumber(ARGV[1]) then redis.call('DECR', KEYS[1]); return 0 end
        return 1
        """;

    private readonly IDatabase _database;
    private readonly int _maximumAllowedRequests;

    public RedisDailyRequestCounter(IConnectionMultiplexer connection, IConfiguration configuration)
    {
        int dailyLimit = configuration.GetValue("Ocr:DailyRequestLimit", 1000);
        int reservedRequests = configuration.GetValue("Ocr:ReservedRequests", 100);

        if (dailyLimit <= 0 || reservedRequests < 0 || reservedRequests >= dailyLimit)
            throw new InvalidOperationException("A configuração diária de OCR é inválida.");

        _maximumAllowedRequests = dailyLimit - reservedRequests;
        _database = connection.GetDatabase();
    }

    public async Task<bool> TryConsumeAsync()
    {
        string key = $"convertex:ocr:requests:{DateTime.UtcNow:yyyy-MM-dd}";
        RedisResult result = await _database.ScriptEvaluateAsync(
            ConsumeScript,
            [new RedisKey(key)],
            [_maximumAllowedRequests, 172800]);

        return (int)result == 1;
    }
}
