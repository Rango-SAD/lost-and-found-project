# Lost and Found System - Visual Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT/USER                              │
│          (Web Browser, Mobile App, API Client)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests (REST API)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SPRING BOOT APPLICATION                       │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Security Layer (JWT Filter)                    │ │
│  │  • Validates JWT tokens from cookies                       │ │
│  │  • Extracts user ID                                        │ │
│  │  • Authorizes requests                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    ItemController                          │ │
│  │  • 13 REST Endpoints                                       │ │
│  │  • Request validation                                      │ │
│  │  • Response formatting                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     ItemService                            │ │
│  │  • Business logic                                          │ │
│  │  • Authorization checks                                    │ │
│  │  • Data transformation                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   ItemRepository                           │ │
│  │  • Database queries                                        │ │
│  │  • JPA operations                                          │ │
│  │  • Custom search methods                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PostgreSQL DATABASE                         │
│                                                                  │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │  users       │         │    items     │                      │
│  │──────────────│         │──────────────│                      │
│  │ id (PK)      │◄────────│ user_id (FK) │                      │
│  │ name         │         │ id (PK)      │                      │
│  │ email        │         │ title        │                      │
│  │ password     │         │ description  │                      │
│  │ created_at   │         │ status       │                      │
│  └──────────────┘         │ category     │                      │
│                           │ tag          │                      │
│                           │ location     │                      │
│                           │ created_at   │                      │
│                           │ updated_at   │                      │
│                           └──────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Creating a Lost/Found Item

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. POST /api/items
     │    {title, description, status, category, tag, location}
     ▼
┌──────────────┐
│  Controller  │
└──────┬───────┘
       │ 2. Extract user ID from JWT
       │ 3. Validate request data
       ▼
┌──────────────┐
│   Service    │
└──────┬───────┘
       │ 4. Create Item entity
       │ 5. Associate with User
       ▼
┌──────────────┐
│  Repository  │
└──────┬───────┘
       │ 6. Save to database
       ▼
┌──────────────┐
│   Database   │
└──────┬───────┘
       │ 7. Return saved item
       ▼
┌─────────┐
│  User   │ ← ItemResponse with ID, timestamps, user info
└─────────┘
```

### 2. Searching for Lost/Found Items

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. GET /api/items/search?keyword=phone&status=FOUND
     ▼
┌──────────────┐
│  Controller  │
└──────┬───────┘
       │ 2. Extract query parameters
       ▼
┌──────────────┐
│   Service    │
└──────┬───────┘
       │ 3. Call search method
       ▼
┌──────────────┐
│  Repository  │
└──────┬───────┘
       │ 4. Execute SQL query with LIKE
       │    WHERE (title LIKE '%phone%' OR 
       │           description LIKE '%phone%')
       │    AND status = 'FOUND'
       ▼
┌──────────────┐
│   Database   │
└──────┬───────┘
       │ 5. Return matching items
       ▼
┌─────────┐
│  User   │ ← List of matching items
└─────────┘
```

## Use Case Flows

### Use Case 1: Lost Item Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                  PERSON LOSES AN ITEM                        │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 1: User creates a post                                │
│  ───────────────────────────────────────────────────────    │
│  POST /api/items                                            │
│  {                                                          │
│    "title": "Lost iPhone 13",                               │
│    "description": "Black iPhone with blue case",            │
│    "status": "LOST",                                        │
│    "category": "ELECTRONICS",                               │
│    "tag": "URGENT",                                         │
│    "location": "University Library"                         │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Item is now searchable by everyone                │
│  ───────────────────────────────────────────────────────    │
│  • Visible in GET /api/items                                │
│  • Searchable via GET /api/items/search?keyword=iphone     │
│  • Filterable via GET /api/items/status/LOST               │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Someone who found the item sees the post          │
│  ───────────────────────────────────────────────────────    │
│  Finder searches: GET /api/items/search?keyword=iphone     │
│  Finds the post and contacts the owner                     │
└─────────────────────────────────────────────────────────────┘
```

### Use Case 2: Found Item Workflow

```
┌─────────────────────────────────────────────────────────────┐
│               PERSON FINDS AN ITEM                           │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Finder creates a post                             │
│  ───────────────────────────────────────────────────────    │
│  POST /api/items                                            │
│  {                                                          │
│    "title": "Found Brown Wallet",                           │
│    "description": "Found wallet with ID cards",             │
│    "status": "FOUND",                                       │
│    "category": "ACCESSORIES",                               │
│    "tag": "IDENTITY_RELATED",                               │
│    "location": "Parking Lot"                                │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Item is now searchable by everyone                │
│  ───────────────────────────────────────────────────────    │
│  • Visible in GET /api/items/status/FOUND                   │
│  • Searchable via GET /api/items/search?keyword=wallet     │
│  • Recent in GET /api/items/recent                          │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Owner searches and finds their item               │
│  ───────────────────────────────────────────────────────    │
│  Owner searches: GET /api/items/search?keyword=wallet      │
│  Finds the post and contacts the finder to retrieve it     │
└─────────────────────────────────────────────────────────────┘
```

## Entity Relationships

```
┌──────────────────────┐          ┌──────────────────────┐
│       User           │          │        Item          │
│──────────────────────│          │──────────────────────│
│ id (PK)              │ 1      * │ id (PK)              │
│ name                 │◄─────────┤ user_id (FK)         │
│ email                │          │ title                │
│ password             │          │ description          │
│ created_at           │          │ status (enum)        │
│ updated_at           │          │ category (enum)      │
└──────────────────────┘          │ tag (enum)           │
                                  │ location             │
                                  │ created_at           │
                                  │ updated_at           │
                                  └──────────────────────┘
```

## Complete API Endpoint Map

```
/api/items
│
├── POST /                           Create new item
│
├── GET /                            Get all items
│
├── GET /{id}                        Get specific item
│
├── PUT /{id}                        Update item (owner only)
│
├── DELETE /{id}                     Delete item (owner only)
│
├── GET /status/{status}             Filter by LOST or FOUND
│   └── GET /paginated              With pagination
│
├── GET /category/{category}         Filter by category
│   └── Options: ELECTRONICS, DOCUMENTS, ACCESSORIES,
│                CLOTHING, JEWELRY, BAGS, KEYS, PETS,
│                SPORTS_EQUIPMENT, BOOKS, OTHER
│
├── GET /tag/{tag}                   Filter by tag
│   └── Options: URGENT, REWARD_OFFERED, SENTIMENTAL_VALUE,
│                HIGH_VALUE, PERISHABLE, FRAGILE,
│                IDENTITY_RELATED, MEDICAL, CHILD_RELATED,
│                ELECTRONICS_TAG, VEHICLE_RELATED
│
├── GET /my-items                    Get current user's items
│
├── GET /search                      Search by keyword
│   └── ?keyword={text}              Search in title/description
│       &status={LOST|FOUND}        Optional status filter
│
├── GET /recent                      Get recent items
│   └── ?limit={number}             Default: 10
│
└── GET /paginated                   Get paginated items
    └── ?page={num}                 Default: 0
        &size={num}                 Default: 20
        &sortBy={field}             Default: createdAt
```

## Status Flow Diagram

```
Item Created with Status
         │
         ├─────────────────┬─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    ┌────────┐       ┌────────┐       ┌─────────┐
    │  LOST  │       │ FOUND  │       │  BOTH   │
    │        │       │        │       │         │
    │ Owner  │       │ Finder │       │ Anyone  │
    │ posts  │       │ posts  │       │ can see │
    └────────┘       └────────┘       └─────────┘
         │                 │                 │
         │                 │                 │
         ▼                 ▼                 ▼
    Search for          Search for       Browse all
    FOUND items         LOST items       items
         │                 │                 │
         └─────────────────┴─────────────────┘
                         │
                         ▼
                  Match Found!
                  Contact Made
                  Item Returned
```

## Data Validation Flow

```
Request Received
      │
      ▼
┌─────────────────────────────────────────┐
│  Validation Checks                      │
│  • Title: Required, max 255 chars      │
│  • Description: Required, max 2000 chars│
│  • Status: Required, must be enum      │
│  • Category: Required, must be enum    │
│  • Tag: Required, must be enum         │
│  • Location: Optional, max 255 chars   │
└─────────────────────────────────────────┘
      │
      ├─── Valid ────────► Process Request
      │
      └─── Invalid ──────► 400 Bad Request
                          {
                            "errors": [
                              "Title is required",
                              "Status must be LOST or FOUND"
                            ]
                          }
```

## Security Flow

```
HTTP Request
      │
      ▼
┌──────────────────────────────────┐
│  JWT Authentication Filter       │
│  • Extract cookie                │
│  • Validate JWT token            │
│  • Extract user ID               │
└──────────────────────────────────┘
      │
      ├─── Token Valid ────────► Continue
      │                           │
      │                           ▼
      │                      ┌─────────────────────────┐
      │                      │  Authorization Check    │
      │                      │  • Owner for updates?   │
      │                      │  • Owner for deletes?   │
      │                      └─────────────────────────┘
      │                           │
      │                           ├── Authorized ──► Process
      │                           │
      │                           └── Unauthorized ─► 403 Forbidden
      │
      └─── Token Invalid ──────► 401 Unauthorized
```

## Complete Feature Summary

```
┌────────────────────────────────────────────────────────────┐
│                   FEATURE CHECKLIST                        │
├────────────────────────────────────────────────────────────┤
│ ✅ Entity with all required fields                         │
│ ✅ Title (String, max 255)                                 │
│ ✅ Description (String, max 2000)                          │
│ ✅ Status (Enum: LOST, FOUND)                              │
│ ✅ Category (Enum: 11 options)                             │
│ ✅ Tag (Enum: 11 options)                                  │
│ ✅ Location (Optional String)                              │
│                                                            │
│ ✅ CRUD Operations                                         │
│ ✅ Create Item (POST)                                      │
│ ✅ Read Item (GET)                                         │
│ ✅ Update Item (PUT)                                       │
│ ✅ Delete Item (DELETE)                                    │
│                                                            │
│ ✅ Filtering                                               │
│ ✅ By Status                                               │
│ ✅ By Category                                             │
│ ✅ By Tag                                                  │
│ ✅ By User                                                 │
│                                                            │
│ ✅ Search & Discovery                                      │
│ ✅ Keyword Search                                          │
│ ✅ Recent Items                                            │
│ ✅ Pagination                                              │
│                                                            │
│ ✅ Security                                                │
│ ✅ JWT Authentication                                      │
│ ✅ Authorization                                           │
│ ✅ Ownership Validation                                    │
│                                                            │
│ ✅ Quality                                                 │
│ ✅ Input Validation                                        │
│ ✅ Error Handling                                          │
│ ✅ Logging                                                 │
│ ✅ Database Indexes                                        │
│ ✅ API Documentation                                       │
│ ✅ Testing Guide                                           │
└────────────────────────────────────────────────────────────┘
```

## Summary

The Lost and Found system is **fully implemented** with:

1. **Clear Purpose**: Handle items that are either LOST (by owner) or FOUND (by finder)
2. **Proper Data Model**: All required fields with appropriate types and constraints
3. **Comprehensive API**: 13 endpoints covering all use cases
4. **Smart Search**: Keyword-based search with filtering
5. **Good Performance**: Pagination and database indexes
6. **Secure**: JWT authentication and authorization
7. **Well-Documented**: README, API guide, and this visual overview

The system successfully enables:
- Lost item owners to post and search for their items
- Finders to post found items
- Both parties to connect and reunite items with owners

