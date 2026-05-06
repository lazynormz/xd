FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["backend.slnx", "./"]
COPY ["XD.Api/XD.Api.csproj", "XD.Api/"]
COPY ["XD.Application/XD.Application.csproj", "XD.Application/"]
COPY ["XD.Domain/XD.Domain.csproj", "XD.Domain/"]
COPY ["XD.Infrastructure/XD.Infrastructure.csproj", "XD.Infrastructure/"]
COPY ["XD.Api.Tests/XD.Api.Tests.csproj", "XD.Api.Tests/"]

RUN dotnet restore "./backend.slnx"

COPY . .

RUN dotnet publish "XD.Api/XD.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:8080 \
    ConnectionStrings__DefaultConnection="Data Source=/data/xd.db" \
    Cors__AllowedOrigins__0=http://localhost:4173 \
    Cors__AllowedOrigins__1=http://localhost:5173

RUN mkdir /data

EXPOSE 8080
VOLUME ["/data"]

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "XD.Api.dll"]
