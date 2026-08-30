FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Convertex-API/Convertex-API.csproj ./Convertex-API/
RUN dotnet restore ./Convertex-API/Convertex-API.csproj

COPY Convertex-API ./Convertex-API
COPY google.credentials.json ./google.credentials.json
RUN dotnet publish ./Convertex-API/Convertex-API.csproj -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/out .
COPY --from=build /google.credentials.json /app/google.credentials.json

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV DOTNET_USE_POLLING_FILE_WATCHER=1
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/google.credentials.json

ENTRYPOINT ["dotnet", "Convertex-API.dll"]