FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY backend.api.csproj ./
RUN dotnet restore backend.api.csproj

COPY . .

RUN dotnet publish backend.api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime

WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "backend.api.dll"]