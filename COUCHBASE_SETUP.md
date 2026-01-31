# Couchbase setup

## If the app shows "Could not locate the bindings file"

The app **automatically uses an in-memory store** when the Couchbase native module cannot load. You can run and test the app without building Couchbase; data will not persist between restarts.

## To use real Couchbase (persistent data)

### Option A: Use Node.js LTS (recommended)

Couchbase 3.x often has prebuilt binaries only for Node LTS. Switch to Node 20 or 22:

```bash
# If you use nvm:
nvm install 20
nvm use 20

# Then reinstall dependencies (no native compile needed if prebuild exists):
rm -rf node_modules package-lock.json
npm install
```

### Option B: Build the native module

1. **Install Xcode Command Line Tools:**
   ```bash
   xcode-select --install
   ```
   Accept the license: `sudo xcodebuild -license accept`

2. **Rebuild Couchbase:**
   ```bash
   npm rebuild couchbase
   ```

3. Restart the app.

### If rebuild still fails

- Use **Node.js LTS 20.x or 22.x** (Option A); Node 23 has no prebuilt Couchbase binaries.
- Or keep using the **in-memory fallback** for local development (data resets on restart).
