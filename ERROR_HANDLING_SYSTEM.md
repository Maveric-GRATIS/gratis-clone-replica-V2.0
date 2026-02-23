# Error Handling System - Implementation Complete

## ✅ Part 13 Section 57: Advanced Error Handling System

Het volledige foutafhandelingssysteem is geïmplementeerd volgens de specificaties van Part 13, Section 57.

---

## 📦 Geïmplementeerde Componenten

### 1. **Error Types** (`src/types/errors.ts`)
Uitgebreide type definities voor het hele error systeem:
- `ErrorSeverity`: LOW, MEDIUM, HIGH, CRITICAL
- `ErrorCategory`: 11 categorieën (auth, database, network, payment, etc.)
- `HttpStatusCode`: Complete HTTP status code enums
- `ErrorResponse`, `ErrorMetadata`, `ErrorLogEntry` interfaces
- `RetryConfig` en `ValidationErrorDetail` types

### 2. **Error Codes Catalog** (`src/lib/errors/error-codes.ts`)
Gestandaardiseerde foutcodes in GRT-XXX-XXX formaat:
- **GRT-001-XXX**: Authentication errors
- **GRT-002-XXX**: Authorization errors
- **GRT-003-XXX**: Validation errors
- **GRT-004-XXX**: Database errors
- **GRT-005-XXX**: Network errors
- **GRT-006-XXX**: External API errors
- **GRT-007-XXX**: File system errors
- **GRT-008-XXX**: Payment errors
- **GRT-009-XXX**: Email errors
- **GRT-010-XXX**: Media errors
- **GRT-999-XXX**: General/Unknown errors

**Helper functies:**
- `getErrorDefinition(code)`
- `isRetryableError(code)`
- `getErrorsByCategory(category)`
- `getErrorsBySeverity(severity)`

### 3. **Custom Error Classes** (`src/lib/errors/app-error.ts`)
Type-safe custom error classes:
- `AppError` - Base class met volledige metadata
- `AuthenticationError` - Login/token fouten
- `AuthorizationError` - Toegang geweigerd
- `ValidationError` - Input validatie met field-level errors
- `DatabaseError` - Firestore operaties
- `NotFoundError` - Resource niet gevonden
- `ConflictError` - Conflicten (duplicates)
- `NetworkError` - Netwerk problemen
- `ExternalAPIError` - Stripe, SendGrid, Mux, Firebase
- `PaymentError` - Betalingen
- `FileSystemError` - File uploads/storage
- `EmailError` - Email verzenden
- `MediaError` - Video/image processing
- `RateLimitError` - Rate limiting
- `ServiceUnavailableError` - Service down
- `TimeoutError` - Operation timeout

**Helper functies:**
- `isAppError(error)` - Type guard
- `isOperationalError(error)` - Check if expected error
- `toAppError(error)` - Convert any error to AppError

### 4. **Global Error Handler** (`src/lib/errors/error-handler.ts`)
Centraal error processing systeem:
- **Logging**: Console (dev) en Firestore (prod)
- **Monitoring**: Sentry integratie (optioneel)
- **Notifications**: Admin alerts voor critical errors
- **Sanitization**: User-friendly messages in production
- **Context tracking**: Request metadata, stack traces
- **Auto-shutdown**: Voor non-operational critical errors

**Public API:**
```typescript
// Singleton instance
errorHandler.handle(error, context);
errorHandler.handleAsync(() => asyncOperation());
errorHandler.handleSync(() => syncOperation());

// Utility functies
handleError(error, context);
withErrorHandling(asyncFn, context);
catchError(promise); // Returns [data, error] tuple
```

### 5. **Retry Logic System** (`src/lib/errors/retry.ts`)
Smart retry met exponential backoff:
- **Exponential backoff**: 2x delay per poging
- **Jitter**: ±25% randomisatie (thundering herd prevention)
- **Max delay cap**: Configurable maximum
- **Retryable detection**: Auto-detect van error codes
- **Statistics tracking**: Success/failure metrics
- **Circuit breaker**: Advanced failure protection

**Default configuraties:**
```typescript
retry(operation, config);              // Custom config
retryWithAttempts(operation, 3);       // Simple retry
retryNetwork(operation);               // 3 attempts, 500ms-5s
retryDatabase(operation);              // 5 attempts, 1s-10s
retryExternalAPI(operation);           // 3 attempts, 2s-30s
```

**Circuit Breaker:**
```typescript
const breaker = new CircuitBreaker(5, 60000); // 5 failures, 1min timeout
await breaker.execute(operation, retryConfig);
```

### 6. **Error Pages**
#### NotFoundPage (`src/pages/NotFoundPage.tsx`)
- User-friendly 404 pagina
- Meertalig (i18n support)
- Suggesties en quick actions
- Back, Home, Search knoppen
- Help links (FAQ, Contact, Helpcentrum)

#### ErrorPage (`src/pages/ErrorPage.tsx`)
- Generic error display
- Severity-based styling
- Error code weergave
- Development mode: Full stack traces
- Suggestions en retry functionaliteit
- Critical error warnings

### 7. **Enhanced ErrorBoundary** (`src/components/ErrorBoundary.tsx`)
React Error Boundary met:
- Integratie met error handler
- ErrorPage rendering
- Auto-reset na 5 minuten
- Custom fallback support
- Reset keys voor controlled reset
- `withErrorBoundary()` HOC

---

## 🚀 Gebruik

### Basis Error Throwing
```typescript
import { ValidationError, DatabaseError, AUTH_ERRORS } from '@/lib/errors';

// Method 1: Direct error class
throw new ValidationError('Invalid email format', [
  { field: 'email', message: 'Must be valid email', value: input }
]);

// Method 2: Van error code definition
throw AppError.fromErrorCode(AUTH_ERRORS.INVALID_CREDENTIALS);
```

### Error Handling
```typescript
import { errorHandler, catchError } from '@/lib/errors';

// Method 1: Try-catch met handler
try {
  await riskyOperation();
} catch (error) {
  await errorHandler.handle(error, { userId, route: '/api/data' });
  throw error;
}

// Method 2: Tuple pattern (geen throw)
const [data, error] = await catchError(fetchUser(id));
if (error) {
  console.error('Failed:', error.code, error.message);
  return null;
}
return data;

// Method 3: Wrap function
const safeFetch = withErrorHandling(fetchData, { route: '/api/data' });
await safeFetch(params);
```

### Retry Logic
```typescript
import { retry, retryDatabase, CircuitBreaker } from '@/lib/errors';

// Auto-retry van database operatie
const user = await retryDatabase(async () => {
  return await getDoc(doc(db, 'users', userId));
});

// Custom retry config
const data = await retry(
  () => fetchExternalAPI(),
  {
    maxAttempts: 5,
    initialDelay: 2000,
    maxDelay: 30000,
    backoffMultiplier: 2
  }
);

// Circuit breaker voor service
const breaker = new CircuitBreaker();
const result = await breaker.execute(() => callUnreliableService());
```

### React Error Boundary
```typescript
// App level
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <RiskyComponent />
</ErrorBoundary>

// With HOC
export default withErrorBoundary(MyComponent, {
  onError: (error, info) => console.log('Component error:', error)
});

// Controlled reset
<ErrorBoundary resetKeys={[userId, dataVersion]}>
  <DynamicContent />
</ErrorBoundary>
```

### Validation Errors
```typescript
const errors = new ValidationError('Form validation failed');
errors.addError('email', 'Required field');
errors.addError('age', 'Must be 18+', 15);

if (errors.hasError('email')) {
  const emailErrors = errors.getErrors('email');
}

throw errors; // Includes all validation details
```

---

## 📊 Error Logging

### Firestore Schema
```typescript
// Collection: errorLogs
{
  id: 'err_1234567890_abc123',
  code: 'GRT-004-002',
  message: 'Database query failed',
  severity: 'high',
  category: 'database',
  timestamp: '2026-02-23T10:30:00Z',
  metadata: {
    userId: 'user123',
    route: '/api/users',
    stack: '...',
    details: { ... }
  },
  resolved: false,
  resolvedAt: null,
  resolvedBy: null
}
```

### Admin Dashboard Query
```typescript
import { collection, query, where, orderBy } from 'firebase/firestore';

// Get unresolved errors
const q = query(
  collection(db, 'errorLogs'),
  where('resolved', '==', false),
  where('severity', 'in', ['high', 'critical']),
  orderBy('timestamp', 'desc')
);
```

---

## 🔧 Configuratie

### Error Handler Config
```typescript
import { errorHandler } from '@/lib/errors';

errorHandler.configure({
  enableLogging: true,           // Log errors
  enableSentry: false,            // Sentry monitoring
  enableConsole: true,            // Console in dev
  logToFirestore: true,           // Store in Firestore
  notifyAdmins: true,             // Email alerts
  shutdownOnCritical: false       // Auto-shutdown
});
```

### Environment Variables
```env
# .env
VITE_ENABLE_ERROR_LOGGING=true
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ADMIN_EMAIL=admin@gratis.ngo
```

---

## 🎯 Best Practices

### 1. **Gebruik juiste error types**
```typescript
// ✅ GOED
throw new ValidationError('Invalid input', validationErrors);
throw new DatabaseError('Failed to save user');
throw AppError.fromErrorCode(AUTH_ERRORS.TOKEN_EXPIRED);

// ❌ FOUT
throw new Error('Something went wrong');
throw 'Error string';
```

### 2. **Voeg context toe**
```typescript
// ✅ GOED
await errorHandler.handle(error, {
  userId: user.id,
  route: req.path,
  action: 'create_donation',
  amount: donation.amount
});

// ❌ FOUT
await errorHandler.handle(error); // No context
```

### 3. **Retry alleen waar zinvol**
```typescript
// ✅ GOED - Transient failures
await retryNetwork(() => fetch(api));
await retryDatabase(() => getDoc(ref));

// ❌ FOUT - Logic errors
await retry(() => validateEmail(email)); // Don't retry validation
await retry(() => checkPermissions()); // Don't retry auth
```

### 4. **Sanitize gevoelige data**
```typescript
// ✅ GOED
throw new PaymentError('Payment failed', {
  details: { orderId: order.id, amount: order.total }
});

// ❌ FOUT
throw new PaymentError('Payment failed', {
  details: {
    cardNumber: '4111111111111111', // PCI violation!
    cvv: '123'
  }
});
```

---

## 🧪 Testing

### Test Error Handling
```typescript
import { AppError, ValidationError } from '@/lib/errors';

describe('Error System', () => {
  it('creates custom error with code', () => {
    const error = AppError.fromErrorCode(AUTH_ERRORS.TOKEN_EXPIRED);
    expect(error.code).toBe('GRT-001-002');
    expect(error.isRetryable()).toBe(true);
  });

  it('validates fields correctly', () => {
    const error = new ValidationError('Failed');
    error.addError('email', 'Invalid format');
    expect(error.hasError('email')).toBe(true);
  });

  it('retries failed operations', async () => {
    let attempts = 0;
    const result = await retry(async () => {
      attempts++;
      if (attempts < 3) throw new NetworkError('Timeout');
      return 'success';
    });
    expect(attempts).toBe(3);
    expect(result).toBe('success');
  });
});
```

---

## 📈 Monitoring & Analytics

### Error Dashboard Metrics
1. **Error Rate**: Totaal errors per tijdsperiode
2. **Error Distribution**: Per category/severity
3. **Top Errors**: Meest voorkomende error codes
4. **Resolution Time**: Gemiddelde tijd tot oplossing
5. **User Impact**: Affected users per error type

### Sentry Integration (Optioneel)
```typescript
// src/lib/integrations/sentry.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export const { captureException, setContext, setTag } = Sentry;
```

---

## ✅ Status: VOLLEDIG GEÏMPLEMENTEERD

- ✅ Error types & interfaces
- ✅ Error code catalog (GRT-XXX-XXX)
- ✅ Custom error classes (15+ types)
- ✅ Global error handler
- ✅ Retry logic met exponential backoff
- ✅ Circuit breaker pattern
- ✅ Error & 404 pages
- ✅ Enhanced ErrorBoundary
- ✅ Firestore logging
- ✅ Console logging (dev)
- ✅ Sentry integratie (optioneel)
- ✅ Admin notifications
- ✅ TypeScript type safety
- ✅ i18n support
- ✅ Documentation

---

## 🔗 Related Files

- **Types**: `src/types/errors.ts`
- **Errors**: `src/lib/errors/` (index, error-codes, app-error, error-handler, retry)
- **Pages**: `src/pages/NotFoundPage.tsx`, `src/pages/ErrorPage.tsx`
- **Component**: `src/components/ErrorBoundary.tsx`
- **Routes**: `src/App.tsx` (404 catch-all route)

---

**Volgende stap**: Implementeer Production Deployment Infrastructure (Section 58) of Media Management System (Section 55).
