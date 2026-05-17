# bqStart Consumer Migration Playbook

This playbook is for teams consuming published bqStart packages and upgrading from the legacy Duende/API Authorization model to the OpenIddict/.NET 10 line.

## 1) Audience and Scope

Use this guide if your app consumes one or more of:

- `BinaryQuest.Framework.Core`
- `BinaryQuest.Framework.Identity.UI`
- `bqStart.Data` patterns
- bqStart auth startup patterns (`AddIdentityServer()`, `AddApiAuthorization()`, `AddIdentityServerJwt()`)

This guide covers:

- package version strategy
- project/runtime upgrades
- startup/auth wiring changes
- database migration sequencing
- test and rollout gates
- rollback plan

---

## 2) Versioning and Support Strategy

Use a dual-track release strategy.

- **Legacy Track**: keep current major (example: `6.x`) for maintenance/security fixes.
- **Next Track**: new major (example: `7.x`) for .NET 10 + OpenIddict changes.

Recommended timeline:

- `7.0.0-alpha.*`: internal + pilot consumers
- `7.0.0-beta.*`: wider opt-in
- `7.0.0-rc.*`: API freeze + migration bug fixes
- `7.0.0`: GA
- Legacy EOL announced with overlap window (for example, 6 months)

---

## 3) Breaking Changes (Consumer View)

Consumers should expect these behavior and integration changes:

1. Target framework baseline moves to `net10.0` (or whatever your new major declares).
2. Duende/API Authorization startup calls are removed:
   - `AddIdentityServer()`
   - `AddApiAuthorization<,>()`
   - `AddIdentityServerJwt()`
3. Auth server implementation is OpenIddict-based.
4. Database schema changes:
   - Duende tables dropped (`DeviceCodes`, `Keys`, `PersistedGrants`)
   - OpenIddict tables created (`OpenIddictApplications`, `OpenIddictAuthorizations`, `OpenIddictScopes`, `OpenIddictTokens`)
5. OIDC client config endpoint remains (`_configuration/{clientId}`), but payload source/implementation changes.

---

## 4) Compatibility Matrix

| Consumer App State | Recommended Package Line | Notes |
|---|---|---|
| .NET 6/7 app, no immediate auth changes possible | Legacy track (`6.x`) | Keep stable until app can move runtime and auth stack |
| .NET 8 app, can plan auth migration | Legacy now, pilot `7.x-beta` in non-prod | Validate DB/auth migration with staging clone |
| .NET 10 app or app upgrading now | Next track (`7.x`) | Preferred long-term line |

---

## 5) Pre-Migration Checklist (Per Consumer App)

- [ ] Capture current package versions and transitive lock file
- [ ] Backup database (or snapshot/point-in-time restore)
- [ ] Confirm staging environment mirrors production auth settings
- [ ] Inventory OIDC clients/scopes currently in use (SPA, desktop, service-to-service)
- [ ] Identify all flows in use: auth code, refresh token, client credentials, logout
- [ ] Freeze unrelated feature releases for migration window

---

## 6) Consumer Upgrade Steps

## Step 1: Create an Upgrade Branch

```zsh
git checkout -b chore/bqstart-openiddict-upgrade
```

## Step 2: Upgrade SDK/TFM

Update app projects to the target framework in the new major line (for example `net10.0`).

## Step 3: Upgrade bqStart Package References

Move all bqStart package references to the same new major.

Example pattern (adapt versions to your release):

```xml
<PackageReference Include="BinaryQuest.Framework.Core" Version="7.0.0" />
<PackageReference Include="BinaryQuest.Framework.Identity.UI" Version="7.0.0" />
```

## Step 4: Replace Startup/Auth Wiring

Remove legacy API Authorization calls and switch to OpenIddict wiring.

### Before (legacy)

```csharp
services.AddIdentityServer()
    .AddApiAuthorization<ApplicationUser, MainDataContext>();

services.AddAuthentication()
    .AddIdentityServerJwt();
```

### After (OpenIddict)

```csharp
services.AddOpenIddict()
    .AddCore(options =>
    {
        options.UseEntityFrameworkCore()
            .UseDbContext<MainDataContext>();
    })
    .AddServer(options =>
    {
        options.SetAuthorizationEndpointUris("/connect/authorize")
               .SetTokenEndpointUris("/connect/token")
               .SetEndSessionEndpointUris("/connect/logout");

        options.AllowAuthorizationCodeFlow()
               .AllowRefreshTokenFlow()
               .AllowClientCredentialsFlow();

        options.RequireProofKeyForCodeExchange();
        options.AddDevelopmentEncryptionCertificate()
               .AddDevelopmentSigningCertificate();

        options.UseAspNetCore()
               .EnableAuthorizationEndpointPassthrough()
               .EnableTokenEndpointPassthrough()
               .EnableEndSessionEndpointPassthrough();
    })
    .AddValidation(options =>
    {
        options.UseLocalServer();
        options.UseAspNetCore();
    });
```

If your app uses cookie + bearer auth together, set a clear default policy for both schemes.

## Step 5: Apply Database Migration

Run migration in staging first.

```zsh
dotnet ef database update --project path/to/Data.csproj --startup-project path/to/Web.csproj
```

## Step 6: Seed OpenIddict Clients/Scopes

Make sure required clients and scopes exist:

- SPA client (`Default`)
- desktop/native client (`electronapp`) if used
- machine client (`cmsclient`) if used
- API scope (`bqStart.WebAPI`)

If your release includes a hosted seeder, verify it ran successfully in logs.

## Step 7: Frontend OIDC Verification

If SPA/desktop OIDC depends on `_configuration/{clientId}`, verify payload values:

- `authority`
- `client_id`
- `redirect_uri`
- `post_logout_redirect_uri`
- `response_type` (`code`)
- `scope`

## Step 8: Run Regression Suite

Minimum test pass list:

- login / logout
- registration (if enabled)
- email confirmation/reset flows
- token refresh
- role/claim gated APIs
- client credentials token and API call

---

## 7) Data Migration Notes

The generated migration typically includes data-destructive operations for old Duende persistence tables. Review carefully before production rollout.

Expected schema direction:

- **Drop**: `DeviceCodes`, `Keys`, `PersistedGrants`
- **Create**: OpenIddict token/application/scope/authorization tables

Operational guidance:

- apply in a low-traffic window
- keep restore plan ready
- monitor auth/token error rates for first 24 hours

---

## 8) Rollout Model

Roll out in cohorts.

1. Internal/non-critical app
2. 1-2 low-risk production consumers
3. remaining consumers in waves

Promotion gate for each wave:

- build + tests green
- auth smoke tests green
- no elevated 401/403/500 trends in monitoring for at least one business cycle

---

## 9) Rollback Plan (Per App)

If a production issue occurs:

1. Roll app deployment back to last known stable build.
2. If DB migration already applied and incompatible with old app:
   - restore DB from pre-migration backup/snapshot.
3. Pin package versions back to legacy line.
4. Re-run legacy auth smoke tests.

Keep rollback drills in staging before first production migration.

---

## 10) Known Risks and Mitigations

- **Risk**: missing client/scope seed data -> login/token failures
  - **Mitigation**: explicit startup verification + health check for required clients/scopes.

- **Risk**: mixed auth defaults (cookie vs bearer) causing unauthorized responses
  - **Mitigation**: explicit authentication schemes and default authorization policy.

- **Risk**: frontend OIDC misconfiguration
  - **Mitigation**: snapshot and compare `_configuration/{clientId}` payload pre/post migration.

- **Risk**: hidden Duende dependency in a consumer extension
  - **Mitigation**: grep for `AddIdentityServer`, `AddApiAuthorization`, `UseIdentityServer`, Duende namespaces before release.

---

## 11) Consumer Communication Template

Use this in release notes/changelog:

- New major `7.0.0` introduces OpenIddict-based auth and .NET 10 baseline.
- `6.x` remains supported for critical fixes until `<date>`.
- Migration requires startup/auth changes and database migration.
- See migration playbook: `CONSUMER_MIGRATION_PLAYBOOK.md`.

---

## 12) Release Readiness Checklist (Publisher Side)

- [ ] Sample app upgraded and validated end-to-end
- [ ] Migration guide published
- [ ] Auth flow test matrix documented
- [ ] NuGet prerelease published and tested by pilot consumers
- [ ] Legacy support window announced
- [ ] GA date and rollback guidance communicated

