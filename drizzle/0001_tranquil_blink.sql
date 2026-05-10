CREATE TABLE `stories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`hook` text,
	`story` text,
	`twistEnding` text,
	`cta` text,
	`hashtags` text,
	`storyType` varchar(64) NOT NULL,
	`tone` varchar(64) NOT NULL,
	`platform` varchar(64) NOT NULL,
	`length` varchar(32) NOT NULL,
	`topic` text,
	`location` varchar(256),
	`characters` text,
	`endingType` varchar(64),
	`coverImageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `stories` ADD CONSTRAINT `stories_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;