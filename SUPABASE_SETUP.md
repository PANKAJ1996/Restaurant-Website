# Supabase Setup for Bubu Dudu ki Duniya

This guide helps you create a free Supabase database to store:
- Customer details
- Order details
- Payment summary
- Reservation records

## 1. Create a Supabase Project

1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project
   - Project name: `bubu-dudu-restaurant`
   - Database password: choose a secure password
   - Region: choose the closest region to you

## 2. Create Tables

### orders
| Column Name | Type | Notes |
|-------------|------|-------|
| id | uuid | Primary key, default: `gen_random_uuid()` |
| order_id | text | Frontend order id |
| created_at | timestamptz | default: `now()` |
| status | text | `completed`, `pending`, etc. |
| total_amount | numeric | Order total amount |
| payment_method | text | `upi`, `credit`, `debit` |
| payment_reference | text | Payment reference ID |
| customer_name | text | Customer name |
| customer_email | text | Customer email |
| customer_phone | text | Customer phone |
| items | jsonb | Cart items as JSON |

### reservations
| Column Name | Type | Notes |
|-------------|------|-------|
| id | uuid | Primary key, default: `gen_random_uuid()` |
| reservation_id | text | Frontend reservation id |
| created_at | timestamptz | default: `now()` |
| status | text | `confirmed`, `cancelled` |
| reservation_date | date | Reservation date |
| reservation_time | text | Reservation time |
| guests | integer | Number of guests |
| customer_name | text | Customer name |
| customer_email | text | Customer email |
| customer_phone | text | Customer phone |
| notes | text | Special requests |

### cancellations
| Column Name | Type | Notes |
|-------------|------|-------|
| id | uuid | Primary key, default: `gen_random_uuid()` |
| cancellation_id | text | Frontend cancellation id |
| created_at | timestamptz | default: `now()` |
| type | text | `reservation` |
| reference_id | text | Related reservation or order id |
| reason | text | Cancellation reason |
| amount | numeric | Refund amount or zero |

## 3. Configure API Keys

1. In Supabase Dashboard, go to Settings > API
2. Copy the `anon public` key
3. Copy the project URL

## 4. Add Supabase Config to script.js

Open `script.js` and update:
```js
const supabaseConfig = {
  url: 'https://YOUR_PROJECT_ID.supabase.co',
  anonKey: 'YOUR_ANON_KEY',
};
```

## 5. Enable Row Level Security (RLS)

1. In Supabase Dashboard, go to `orders` table > Security
2. Turn on Row Level Security
3. Create policy:
   - Name: `Allow inserts from anon`
   - Action: `INSERT`
   - Using: `auth.role() = 'anon'`
   - With check: `auth.role() = 'anon'`

Repeat for `reservations` and `cancellations`.

## 6. Test in Browser

1. Open `cart.html`
2. Add items to cart
3. Fill customer details
4. Choose payment method
5. Click `Checkout`

If configured correctly, order data will be saved locally and also sent to Supabase.

## Notes

- This is a free database setup using Supabase.
- No backend server is required for basic insert-only storage.
- Sensitive card details are masked and should not be stored directly.
- Use Supabase storage only for order metadata and customer contact data.
