# --- Build stage ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj first for better layer caching
COPY Puniemu.csproj ./
RUN dotnet restore Puniemu.csproj

# Copy everything else and publish
COPY . .
RUN dotnet publish Puniemu.csproj -c Release -r linux-x64 --self-contained false -o /out

# --- Runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /out .

# Create dataDownload directory (for help.html if provided)
RUN mkdir -p /app/dataDownload

EXPOSE 8080

ENTRYPOINT ["dotnet", "Puniemu.dll"]
