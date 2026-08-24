CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`nameEn` varchar(255),
	`descriptionAr` text,
	`descriptionEn` text,
	`category` varchar(64) NOT NULL DEFAULT 'ورق عنب',
	`price` int NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'EGP',
	`options` json,
	`imageSlot` varchar(128),
	`isVisible` boolean NOT NULL DEFAULT true,
	`isArchived` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `site_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slot` varchar(128) NOT NULL,
	`labelAr` varchar(255) NOT NULL,
	`altAr` varchar(255),
	`storageKey` varchar(512) NOT NULL,
	`url` varchar(1024) NOT NULL,
	`mimeType` varchar(128) NOT NULL,
	`sizeBytes` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updatedBy` int,
	CONSTRAINT `site_images_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_images_slot_unique` UNIQUE(`slot`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` varchar(128) NOT NULL,
	`group` varchar(64) NOT NULL,
	`value` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updatedBy` int,
	CONSTRAINT `site_settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(128) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `products_public_idx` ON `products` (`isVisible`,`isArchived`,`sortOrder`);--> statement-breakpoint
CREATE INDEX `site_settings_group_idx` ON `site_settings` (`group`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);