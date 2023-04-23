CREATE TABLE "fish_inventory" (
  "id" UUID NOT NULL,
  "fish_name" varchar(255) NOT NULL,
  "origin" varchar(255) NOT NULL,
  "price" varchar(255) NOT NULL,
  "description" varchar(255) NOT NULL,
  "status" varchar(255) NOT NULL,
  "display" boolean NOT NULL,
  "image_source" varchar(255) NOT NULL,
  "video_source" varchar(255) NULL,
  "seller_id" UUID NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
)

CREATE TABLE "users" (
  "id" UUID NOT NULL,
  "email" varchar(255) NOT NULL UNIQUE,
  "seller_name" varchar(255) NOT NULL UNIQUE,
  "password" varchar(255) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
)