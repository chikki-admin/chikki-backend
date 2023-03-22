CREATE TABLE "fish_inventory" (
  "id" UUID NOT NULL,
  "fish_name" varchar(255) NOT NULL,
  "origin" varchar(255) NOT NULL,
  "price" varchar(255) NOT NULL,
  "description" varchar(255) NOT NULL,
  "bought" boolean NOT NULL,
  "display" boolean NOT NULL,
  "image_source" varchar(255) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
)


ALTER USER postgres WITH PASSWORD 'newpassword';