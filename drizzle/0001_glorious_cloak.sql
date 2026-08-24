CREATE TABLE `customer_review_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`labelAr` varchar(255) NOT NULL,
	`altAr` varchar(255),
	`storageKey` varchar(512) NOT NULL,
	`url` varchar(1024) NOT NULL,
	`mimeType` varchar(128) NOT NULL,
	`sizeBytes` int NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isVisible` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`updatedBy` int,
	CONSTRAINT `customer_review_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `review_images_public_idx` ON `customer_review_images` (`isVisible`,`sortOrder`);