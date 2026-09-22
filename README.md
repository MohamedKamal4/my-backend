# Backend API

A REST API for categories, subcategories, brands, products, and users. The application uses Express 5, MongoDB/Mongoose, Multer, Sharp, Cloudinary, and `express-validator`.

## Current Features

- CRUD-style routes for categories, subcategories, brands, products, and users
- Nested category, subcategory, and brand product routes
- Product and user image upload, resizing, WebP conversion, and Cloudinary storage
- Query filtering, keyword search, sorting, field selection, and pagination
- Request validation with `express-validator`
- Centralized Express error handling and development request logging with Morgan

Authentication and authorization are not implemented. Every mounted endpoint is publicly accessible, including user, password, and image-management routes. The `role` field is stored on users but is not enforced.

## Requirements

- Node.js 18 or newer
- MongoDB database, local or hosted
- Cloudinary account for image operations
- Nodemon for `npm run dev` (not declared in `package.json`)

## Installation

```powershell
npm install
npm install --global nodemon
```

Create a `.env` file in the project root. These are the environment variables read by the application:

```env
PORT=8000
NODE_ENV=development
DB_CONNECT_FOR_MONGOOSE_URI=mongodb://127.0.0.1:27017/backend-course
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

`server.js` loads `.env` at startup, connects using `DB_CONNECT_FOR_MONGOOSE_URI`, and listens on `PORT`. Keep `.env` out of source control. Other values that may exist in a local environment file are not referenced by the application.

## Running the API

```powershell
# Development; restarts when files change
npm run dev

# Direct execution
node server.js

# Production script on Windows
npm run production
```

The default example URL is `http://localhost:8000`. The server uses the value of `PORT` when it is set.

## Dependencies and Scripts

Runtime dependencies declared in `package.json` are `bcryptjs`, `cloudinary`, `dotenv`, `express`, `express-async-handler`, `express-validator`, `mongoose`, `morgan`, `multer`, `sharp`, and `slugify`.

| Script       | Command                                     | Purpose                                                           |
| ------------ | ------------------------------------------- | ----------------------------------------------------------------- |
| `dev`        | `nodemon server.js`                         | Run with automatic restarts; Nodemon must be installed separately |
| `production` | `set NODE_ENV=production && node server.js` | Run in production mode on Windows                                 |

There is no automated test script.

## API Reference

All routes use the `/api/v1` prefix. Replace `:id` and `:imageId` with MongoDB document IDs.

### Categories

| Method   | Path                                   | Purpose                           |
| -------- | -------------------------------------- | --------------------------------- |
| `GET`    | `/api/v1/categories`                   | List categories                   |
| `POST`   | `/api/v1/categories`                   | Create a category                 |
| `GET`    | `/api/v1/categories/:id`               | Get one category                  |
| `PUT`    | `/api/v1/categories/:id`               | Update a category                 |
| `DELETE` | `/api/v1/categories/:id`               | Delete a category                 |
| `GET`    | `/api/v1/categories/:id/subCategories` | List subcategories for a category |
| `POST`   | `/api/v1/categories/:id/subCategories` | Create a nested subcategory route |
| `GET`    | `/api/v1/categories/:id/products`      | List products for a category      |
| `POST`   | `/api/v1/categories/:id/products`      | Create a nested product route     |

### Subcategories

| Method   | Path                                 | Purpose                         |
| -------- | ------------------------------------ | ------------------------------- |
| `GET`    | `/api/v1/subCategories`              | List subcategories              |
| `POST`   | `/api/v1/subCategories`              | Create a subcategory            |
| `GET`    | `/api/v1/subCategories/:id`          | Get one subcategory             |
| `PUT`    | `/api/v1/subCategories/:id`          | Update a subcategory            |
| `DELETE` | `/api/v1/subCategories/:id`          | Delete a subcategory            |
| `GET`    | `/api/v1/subCategories/:id/products` | List products for a subcategory |
| `POST`   | `/api/v1/subCategories/:id/products` | Create a nested product route   |

### Brands

| Method   | Path                          | Purpose                       |
| -------- | ----------------------------- | ----------------------------- |
| `GET`    | `/api/v1/brands`              | List brands                   |
| `POST`   | `/api/v1/brands`              | Create a brand                |
| `GET`    | `/api/v1/brands/:id`          | Get one brand                 |
| `PUT`    | `/api/v1/brands/:id`          | Update a brand                |
| `DELETE` | `/api/v1/brands/:id`          | Delete a brand                |
| `GET`    | `/api/v1/brands/:id/products` | List products for a brand     |
| `POST`   | `/api/v1/brands/:id/products` | Create a nested product route |

### Products

| Method   | Path                                   | Purpose                                |
| -------- | -------------------------------------- | -------------------------------------- |
| `GET`    | `/api/v1/products`                     | List products                          |
| `POST`   | `/api/v1/products`                     | Create a product; accepts image fields |
| `GET`    | `/api/v1/products/:id`                 | Get one product                        |
| `PUT`    | `/api/v1/products/:id`                 | Update a product                       |
| `DELETE` | `/api/v1/products/:id`                 | Delete a product                       |
| `PUT`    | `/api/v1/products/:id/images`          | Append product images                  |
| `DELETE` | `/api/v1/products/:id/images/:imageId` | Delete one product image               |
| `PUT`    | `/api/v1/products/:id/imageCover`      | Replace the product cover image        |
| `DELETE` | `/api/v1/products/:id/imageCover`      | Delete the product cover image         |

### Users

| Method   | Path                               | Purpose                                |
| -------- | ---------------------------------- | -------------------------------------- |
| `GET`    | `/api/v1/users`                    | List users                             |
| `POST`   | `/api/v1/users`                    | Create a user; accepts a profile image |
| `GET`    | `/api/v1/users/:id`                | Get one user                           |
| `PUT`    | `/api/v1/users/:id`                | Update a user                          |
| `DELETE` | `/api/v1/users/:id`                | Run the user delete handler            |
| `PUT`    | `/api/v1/users/:id/profile`        | Replace the profile image              |
| `DELETE` | `/api/v1/users/:id/profile`        | Delete the profile image               |
| `PUT`    | `/api/v1/users/changePassword/:id` | Change a user's password               |

The current user delete handler updates the user with `req.body` and returns `204`; it does not remove the user document. Nested `POST` handlers are registered, but their shared parent-ID injection middleware is called without the required ID option, so parent IDs are not reliably inserted. Treat both behaviors as implementation limitations.

## Request Bodies and Validation

Normal CRUD requests use JSON. Validation failures are returned before the controller runs.

### Categories

Create and update require `name`, a string between 3 and 32 characters. The model also stores a generated lowercase `slug`, an optional `image`, and timestamps.

### Subcategories

- Create requires `name` (2-32 characters) and `parent_category`.
- `parent_category` must be a valid MongoDB ID referring to an existing category.
- Update accepts optional `name` and `parent_category` with the same validation when supplied.
- The model stores `image`, generated lowercase `slug`, `parent_category`, and timestamps.

### Brands

- Create requires `name` between 2 and 32 characters.
- Update accepts an optional `name`.
- The update validator also checks an optional `category` value against a category, but `category` is not a field in the brand schema.
- The model stores `name`, generated lowercase `slug`, `image`, and timestamps.

### Products

Create requires:

- `name`: 2-100 characters
- `descraption`: at least 20 characters
- `quantity`: numeric
- `orignal_price`: numeric and at least 0
- `main_category`: valid existing category ID
- `sub_category`: valid ID belonging to `main_category`
- `brand`: valid MongoDB ID

Optional create and update fields are `price_with_discount`, `colors`, `rating_average`, `reviews`, and `sizes`. `price_with_discount` must be lower than `orignal_price`; `rating_average` must be between 1 and 5; `colors` and `sizes` must be arrays; and `reviews` must be numeric. Product updates make these fields optional but recheck product existence and category/subcategory consistency.

The model also contains `Image_Cover`, `Images`, generated lowercase `slug`, `sold`, and timestamps. The spellings `descraption` and `orignal_price` match the current source code.

### Users

Create requires:

- `name`: string, 3-50 characters
- `email`: valid, normalized, and unique
- `phone`: valid Egyptian mobile number
- `password`: at least 8 characters
- `passwordConfirm`: must match `password`

Update accepts optional `name`, `email`, and `phone` and validates the user ID. Password changes require `currentPassword`, `password`, and `passwordConfirm`; the current password must be correct, the new password must be at least 8 characters and different from the current password, and the confirmation must match. Passwords are hashed with bcrypt before saving.

The user model also stores `profile`, `role` (`user` or `admin`, default `user`), `active` (default `true`), a lowercase `slug`, and timestamps.

## Query Parameters

Collection and nested `GET` routes pass through the shared query feature helper:

- `keyword`: case-insensitive search on `name`. The current controllers do not pass the product model name to the helper, so product searches currently search only `name`, not `descraption`.
- `page`: page number, default `1`
- `limit`: results per page, default `20`
- `sort`: comma-separated fields, for example `sort=-price_with_discount,name`
- `fields`: comma-separated field selection
- Any other query field: exact filter, with comparison operators encoded as `[gte]`, `[gt]`, `[lte]`, or `[lt]`

Without `sort`, results are sorted by ascending `createdAt`.

Example:

```text
GET /api/v1/products?keyword=phone&page=1&limit=10&sort=-createdAt&fields=name,orignal_price
```

List responses contain `results`, `page`, and `data`. Single-item responses contain `data`.

## Uploads and Cloudinary

Upload endpoints use `multipart/form-data`. Multer stores files in memory, accepts only MIME types beginning with `image/`, and limits each file to 5 MB.

| Route area                   | Field         | Route limit               | Processing                                                                   |
| ---------------------------- | ------------- | ------------------------- | ---------------------------------------------------------------------------- |
| Product creation             | `Image_Cover` | 1 file                    | Resize to `1024x765`, convert to WebP at quality 80                          |
| Product creation             | `Images`      | 5 files                   | Resize to `1024x765`, convert to WebP at quality 80                          |
| Product image append         | `Images`      | No route-level `maxCount` | Resize to `1024x765`, convert to WebP at quality 80                          |
| Product cover replacement    | `Image_Cover` | 1 file                    | Uses the `profile` folder and `500x500` resize in the current implementation |
| User creation/profile update | `profile`     | 1 file                    | Resize to `500x500`, convert to WebP at quality 80                           |

Cloudinary credentials are read from `CLOUD_NAME`, `API_KEY`, and `API_SECRET`. Stored image values contain `secure_url` and `public_id`.

## Responses and Errors

- Collection `GET`: `200` with `{ "results": number, "page": number, "data": [] }`
- Single `GET`: `200` with `{ "data": {} }`
- Create: `201` with `{ "data": {} }`
- Update: `200` with `{ "data": {} }`
- Standard category, subcategory, brand, and product deletes: `204` with an empty body
- User delete handler: `204` with an empty body after updating the user
- Image operations: `200` with a message and data payload
- Validation failures: `400` with an `errors` array
- Missing resources: normally `404`
- Unknown routes: `400` through the global error handler

In development, errors include `status`, `error`, `message`, and `stack`. Outside development, errors include only `status` and `message`. User reads and responses do not exclude the hashed `password` field. The password-change controller also has an unhandled missing-user error path because it references `ApiError` without importing it.

## Relationships

- Subcategories reference categories through `parent_category`.
- Products reference `main_category`, `sub_category`, and `brand`.
- Product queries automatically populate those three references with only `_id` and `name`.
- Product creation validates that the selected subcategory belongs to the selected main category.

## Project Structure

```text
config/       Database connection
constens/     Error and filter constants
controlers/   Controllers and reusable request handlers
middlewares/  Validation, filtering, uploads, and error handling
models/       Mongoose schemas
routes/       Resource and nested routes
utils/        API errors, query features, Cloudinary, validators, and seed data
server.js     Application entry point
```

## Known Implementation Limitations

- Authentication and authorization are not implemented.
- `DELETE /api/v1/users/:id` updates rather than deletes a user.
- Nested `POST` routes do not reliably inject the parent ID because of the current middleware call.
- Product keyword search currently checks only `name`.
- Product cover replacement uses profile image processing settings.
- User responses can expose the hashed password.
- Unknown routes return `400`, and the database connection function does not explicitly handle connection failures.
