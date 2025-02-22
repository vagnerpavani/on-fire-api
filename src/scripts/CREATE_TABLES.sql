CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email TEXT UNIQUE,
	"recordStreak" INTEGER DEFAULT 0,
	"currentStreak" INTEGER DEFAULT 0,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
	id SERIAL PRIMARY KEY,
	"beehivId" TEXT,
	title TEXT,
	"publishedAt" TIMESTAMP NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "reads" (
	id SERIAL PRIMARY KEY,
	"userId" INTEGER NOT NULL REFERENCES users(id),
	"postId" INTEGER NOT NULL REFERENCES posts(id),
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"utmSource" TEXT,
	"utmMedium" TEXT,
	"utmCampaign" TEXT,
	"utmChannel" TEXT
);

CREATE INDEX "idxEmail"
ON users (email);

CREATE INDEX "idxBeehivId"
ON posts("beehivId");