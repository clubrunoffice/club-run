# Working Login Credentials

## Database Users (Recommended)
All passwords: `admin123`

- **Admin**: `admin@test.com` / `admin123`
- **Operations**: `operations@test.com` / `admin123`
- **Partner**: `partner@test.com` / `admin123`

## Mock Users (In-Memory)
All passwords: `Demo123!`

- **Admin**: `admin@clubrun.com` / `Demo123!`
- **Runner**: `runner@demo.com` / `Demo123!`
- **DJ**: `dj@demo.com` / `Demo123!`
- **Verified DJ**: `verified-dj@demo.com` / `Demo123!`
- **Client**: `client@demo.com` / `Demo123!`
- **Curator**: `curator@demo.com` / `Demo123!`
- **Operations**: `operations@demo.com` / `Demo123!`
- **Partner**: `partner@demo.com` / `Demo123!`

## Test All Roles

### Database Accounts (Case-Insensitive)
```
admin@test.com / admin123
operations@test.com / admin123
partner@test.com / admin123
```

### Mock Accounts (Use exact email)
```
runner@demo.com / Demo123!
dj@demo.com / Demo123!
verified-dj@demo.com / Demo123!
client@demo.com / Demo123!
curator@demo.com / Demo123!
```

## Quick Test
1. Login as **admin@test.com** / **admin123** - Full admin access
2. Login as **client@demo.com** / **Demo123!** - Client features
3. Login as **dj@demo.com** / **Demo123!** - DJ features
4. Login as **curator@demo.com** / **Demo123!** - Team coordination

---
**Note**: Database users use `admin123` password. Mock users use `Demo123!` password.
