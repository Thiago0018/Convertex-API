using StackExchange.Redis;

namespace MeuProjetoVision.Extensions;

public static class RedisExtensions
{
    public static ConfigurationOptions CreateRedisConfiguration(this string connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new ArgumentException("A string de conexão do Redis não pode ser vazia.", nameof(connectionString));

        if (!Uri.TryCreate(connectionString.Trim(), UriKind.Absolute, out Uri? redisUri) ||
            (redisUri.Scheme != "redis" && redisUri.Scheme != "rediss") ||
            string.IsNullOrWhiteSpace(redisUri.Host))
        {
            return ConfigurationOptions.Parse(connectionString);
        }

        ConfigurationOptions configuration = new()
        {
            Ssl = redisUri.Scheme == "rediss",
            AbortOnConnectFail = false
        };
        configuration.EndPoints.Add(redisUri.Host, redisUri.Port > 0 ? redisUri.Port : 6379);

        if (!string.IsNullOrEmpty(redisUri.UserInfo))
        {
            string[] userInfo = redisUri.UserInfo.Split(':', 2);
            configuration.User = Uri.UnescapeDataString(userInfo[0]);
            if (userInfo.Length == 2)
                configuration.Password = Uri.UnescapeDataString(userInfo[1]);
        }

        return configuration;
    }
}
