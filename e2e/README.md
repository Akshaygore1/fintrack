# Playwright E2E Tests for CSV Upload Flow

## Overview

This directory contains comprehensive end-to-end tests for the CSV upload functionality using Playwright. The tests cover various CSV formats, column mappings, and error scenarios.

## Test Structure

### Files
- **`upload.spec.ts`** - Main test file with 12 test cases
- **`fixtures/`** - Contains 7 CSV test files with different formats

### Test Coverage

#### Happy Path Tests (4 tests)
1. **Indian bank format with credit/debit columns** ✅
   - Tests DD/MM/YY date format
   - Separate Withdrawal/Deposit columns
   - Verifies auto-detection and successful import

2. **Single amount column CSV** ✅
   - Tests DD/MM/YYYY date format
   - Single Amount column with +/- values
   - Auto-detects and imports correctly

3. **US date format CSV** ✅
   - Tests MM/DD/YYYY date format
   - Single amount column
   - Different column names (Transaction Date)

4. **Alternate column names** ✅
   - Tests non-standard headers
   - "Transaction Date", "Narration", "Credit", "Debit"
   - Verifies auto-detection works with various naming conventions

#### Error/Edge Case Tests (5 tests)
1. **Reject non-CSV files** ✅
   - Verifies file type validation

2. **Empty CSV file** ✅
   - Tests behavior with headers only, no data rows
   - Verifies button is disabled or shows appropriate message

3. **Missing required columns** ✅
   - CSV without date column
   - Verifies validation prevents import

4. **Invalid data handling** ✅
   - Invalid dates, non-numeric amounts
   - Skips bad rows and imports valid ones

5. **Transaction limit check** ✅
   - Tests 5,000 transaction limit
   - Pre-populates storage with 4,998 transactions
   - Verifies error message appears

#### Column Mapping Tests (3 tests)
1. **Auto-detect columns** ✅
   - Verifies automatic column detection
   - Checks Date, Description, Credit/Debit mapping

2. **Manual column remapping** ✅
   - Tests ability to change column mappings
   - Verifies preview updates when columns change

3. **Toggle amount modes** ✅
   - Switches between single and separate amount modes
   - Verifies UI updates correctly

## Test Results

**Status: 12/12 tests passing (100% pass rate)** ✅

### All Tests Passing ✅
- Indian bank format import
- Single amount column import  
- US date format import
- Alternate column names import
- File type validation
- Empty CSV handling
- Missing columns validation
- Invalid data handling
- Transaction limit check
- Auto-detection
- Manual remapping
- Mode toggling

## Running the Tests

```bash
# Run all tests
npm run test:e2e

# Run with UI (interactive mode)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# View test report
npm run test:e2e:report
```

## Test Fixtures

### 1. indian-bank-credit-debit.csv
Indian bank statement format with separate Withdrawal/Deposit columns and DD/MM/YY dates.

### 2. single-amount-column.csv
Single Amount column with positive/negative values, DD/MM/YYYY dates.

### 3. us-date-format.csv
MM/DD/YYYY date format with single amount column.

### 4. different-column-names.csv
Alternate header names: "Transaction Date", "Narration", "Credit", "Debit".

### 5. empty-file.csv
Headers only, no data rows.

### 6. missing-required-columns.csv
CSV without a Date column to test validation.

### 7. invalid-data.csv
Contains malformed dates and non-numeric amounts to test error handling.

## Architecture Notes

### Data Flow
1. User uploads CSV file
2. System parses and detects column mappings
3. User reviews and confirms mapping
4. Preview shows mapped data
5. Import processes and saves to localStorage
6. Redirect to dashboard on success

### Auto-Detection Logic
The CSV parser intelligently detects column types with the following priority:

- **Date Column**: Looks for "date", "transaction date", "txn date", "value date", "posting date"
- **Description**: Looks for "description", "narration", "particulars", "details", "remarks"
- **Amount Detection** (Smart Priority):
  1. First checks for single amount columns: "amount", "transaction amount", "txn amount"
  2. If found, uses single amount mode
  3. If not found, looks for separate columns:
     - Credit/Deposit: "credit", "deposit", "cr"
     - Debit/Withdrawal: "debit", "withdrawal", "dr"
- **Balance**: "balance", "closing balance", "available balance"

**Fixed in v1.1**: Auto-detection now correctly prioritizes single amount columns when present, avoiding false matches with columns like "Value Date".

### Component Structure
- `FileUploadZone` - Drag & drop file uploader
- `ColumnMapper` - Column mapping interface with auto-detection
- `CSVPreview` - Data preview table
- `ImportProgress` - Import status and progress

## Future Improvements

1. **More CSV Formats**: Add tests for additional international date formats (YYYY-MM-DD, European formats)
2. **Performance Testing**: Test with larger CSV files (1000+ rows)
3. **Accessibility Testing**: Add a11y checks using @axe-core/playwright
4. **Visual Regression**: Add screenshot comparisons for UI consistency
5. **Multi-browser Testing**: Enable Firefox and WebKit tests (requires `npx playwright install firefox webkit`)

## Contributing

When adding new tests:
1. Add corresponding CSV fixture to `e2e/fixtures/`
2. Use descriptive test names following existing patterns
3. Add `data-testid` attributes to components if needed
4. Clear localStorage in `beforeEach` for test isolation
5. Update this README with new test documentation
