-- =====================================================================
-- Landmark Port Harcourt — MySQL schema
-- =====================================================================
-- Every table uses InnoDB + utf8mb4. Timestamps are UTC.
-- Singletons (siteSettings, hero, intro, flagship, citizenApp, overlap,
-- panorama, siteMap, reveal, visit) live as JSON blobs in `settings`
-- keyed by section name. Collections have proper relational tables so
-- the admin CRUD can order + edit rows individually.
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `nav_links`;
DROP TABLE IF EXISTS `intro_pillars`;
DROP TABLE IF EXISTS `zone_items`;
DROP TABLE IF EXISTS `zones`;
DROP TABLE IF EXISTS `waterfront_gallery`;
DROP TABLE IF EXISTS `fnb_vendors`;
DROP TABLE IF EXISTS `ticket_items`;
DROP TABLE IF EXISTS `ticket_categories`;
DROP TABLE IF EXISTS `citizen_features`;
DROP TABLE IF EXISTS `rooms`;
DROP TABLE IF EXISTS `panorama_chapters`;
DROP TABLE IF EXISTS `reveal_callouts`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `admin_users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ------- Auth ---------------------------------------------------------
CREATE TABLE `admin_users` (
  `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `email`         VARCHAR(191)    NOT NULL,
  `password_hash` VARCHAR(255)    NOT NULL,
  `name`          VARCHAR(120)    NOT NULL,
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_admin_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- Singleton content (key/JSON) ---------------------------------
-- One row per top-level content.json key that doesn't need a collection
-- (siteSettings, hero, intro, flagship, citizenApp, overlap, panorama,
--  siteMap, reveal, visit).
CREATE TABLE `settings` (
  `section`    VARCHAR(64) NOT NULL,
  `value`      JSON         NOT NULL,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`section`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- Nav links (site header) --------------------------------------
CREATE TABLE `nav_links` (
  `id`        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `label`     VARCHAR(120) NOT NULL,
  `href`      VARCHAR(255) NOT NULL,
  `sort_order` INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_nav_links_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- Intro pillars (three-up on Concept section) ------------------
CREATE TABLE `intro_pillars` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`      VARCHAR(180) NOT NULL,
  `body`       TEXT         NOT NULL,
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_intro_pillars_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- Zones (Ring / Green / Waterfront) ----------------------------
CREATE TABLE `zones` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`           VARCHAR(64)  NOT NULL,
  `zone_label`     VARCHAR(120),
  `title`          VARCHAR(180) NOT NULL,
  `intro`          TEXT,
  `hero_image_url` VARCHAR(500),
  `aside_image`    VARCHAR(500),
  `cta_label`      VARCHAR(120),
  `day_pass_label` VARCHAR(120),
  `callout`        TEXT,
  `features`       JSON,
  `stats`          JSON,
  `sort_order`     INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_zones_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- Zone items (activities inside a zone) ------------------------
CREATE TABLE `zone_items` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `zone_id`    INT UNSIGNED NOT NULL,
  `title`      VARCHAR(180) NOT NULL,
  `area`       VARCHAR(80),
  `body`       TEXT,
  `image_url`  VARCHAR(500),
  `icon`       VARCHAR(80),
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_zone_items_zone` (`zone_id`),
  CONSTRAINT `fk_zone_items_zone` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- Waterfront gallery (kept separate — different shape) ---------
CREATE TABLE `waterfront_gallery` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`      VARCHAR(180) NOT NULL,
  `tag`        VARCHAR(180),
  `image_url`  VARCHAR(500) NOT NULL,
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- F&B vendors (line-up at The Table) ---------------------------
CREATE TABLE `fnb_vendors` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(180) NOT NULL,
  `kind`       VARCHAR(120),
  `body`       TEXT,
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- Tickets ------------------------------------------------------
CREATE TABLE `ticket_categories` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key_slug`   VARCHAR(64)  NOT NULL,
  `label`      VARCHAR(120) NOT NULL,
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ticket_categories_key` (`key_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ticket_items` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`             VARCHAR(120) NOT NULL,
  `category_key`     VARCHAR(64)  NOT NULL,
  `name`             VARCHAR(180) NOT NULL,
  `tag`              VARCHAR(180),
  `price_ngn`        INT          NOT NULL DEFAULT 0,
  `price_unit`       VARCHAR(80),
  `body`             TEXT,
  `featured`         TINYINT(1)   NOT NULL DEFAULT 0,
  `includes`         JSON,
  `sort_order`       INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ticket_items_slug` (`slug`),
  KEY `idx_ticket_items_category` (`category_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- Citizen App features ----------------------------------------
CREATE TABLE `citizen_features` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `icon`       VARCHAR(80),
  `label`      VARCHAR(180) NOT NULL,
  `body`       TEXT,
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- Rooms & Stays -----------------------------------------------
CREATE TABLE `rooms` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(180) NOT NULL,
  `tag`        VARCHAR(180),
  `size`       VARCHAR(60),
  `guests`     VARCHAR(60),
  `price_from` VARCHAR(120),
  `body`       TEXT,
  `image_url`  VARCHAR(500),
  `features`   JSON,
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- Panorama chapters -------------------------------------------
CREATE TABLE `panorama_chapters` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`      VARCHAR(180) NOT NULL,
  `body`       TEXT,
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- Reveal callouts ---------------------------------------------
CREATE TABLE `reveal_callouts` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `label`      VARCHAR(180) NOT NULL,
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------- Bookings (from the /bookings/:type flow) --------------------
CREATE TABLE `bookings` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference`      VARCHAR(32)  NOT NULL,
  `booking_type`   VARCHAR(64)  NOT NULL,
  `first_name`     VARCHAR(120),
  `last_name`      VARCHAR(120),
  `email`          VARCHAR(191) NOT NULL,
  `phone`          VARCHAR(60),
  `date_from`      DATE,
  `date_to`        DATE,
  `time_slot`      VARCHAR(20),
  `guests`         INT UNSIGNED NOT NULL DEFAULT 1,
  `add_ons`        JSON,
  `total_ngn`      INT UNSIGNED NOT NULL DEFAULT 0,
  `status`         ENUM('pending','confirmed','hold','cancelled') NOT NULL DEFAULT 'pending',
  `notes`          TEXT,
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bookings_reference` (`reference`),
  KEY `idx_bookings_type` (`booking_type`),
  KEY `idx_bookings_status` (`status`),
  KEY `idx_bookings_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
