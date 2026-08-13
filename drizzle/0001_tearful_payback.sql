CREATE TABLE `tools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`communityId` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(64) NOT NULL,
	`description` text NOT NULL,
	`status` enum('available','borrowed') NOT NULL DEFAULT 'available',
	`icon` varchar(64) NOT NULL,
	`accent` varchar(16) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tools_id` PRIMARY KEY(`id`),
	CONSTRAINT `tools_owner_community_name_idx` UNIQUE(`ownerId`,`communityId`,`name`)
);
--> statement-breakpoint
CREATE TABLE `wishlistEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`toolId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wishlistEntries_id` PRIMARY KEY(`id`),
	CONSTRAINT `wishlist_user_tool_idx` UNIQUE(`userId`,`toolId`)
);
