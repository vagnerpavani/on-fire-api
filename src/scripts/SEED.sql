TRUNCATE reads, users, posts RESTART IDENTITY;

INSERT INTO users ("email", "recordStreak", "currentStreak") 
VALUES ('teste@teste.com', 3, 2);

INSERT INTO users ("email", "recordStreak", "currentStreak") 
VALUES ('teste2@teste.com', 1, 0);

INSERT INTO users ("email", "recordStreak", "currentStreak") 
VALUES ('teste3@teste.com', 2, 1);

INSERT INTO users ("email", "recordStreak", "currentStreak") 
VALUES ('teste4@teste.com', 4, 4);

INSERT INTO users ("email", "recordStreak", "currentStreak") 
VALUES ('teste5@teste.com', 4, 3);

INSERT INTO users ("email", "recordStreak", "currentStreak") 
VALUES ('teste6@teste.com', 1, 0);


INSERT INTO posts ("beehivId", title, "publishedAt") 
VALUES ('post_00-00-01','title',NOW() - INTERVAL '2 day');

INSERT INTO posts ("beehivId", title, "publishedAt") 
VALUES ('post_00-00-02','title',NOW() - INTERVAL '3 day');

INSERT INTO posts ("beehivId", title, "publishedAt") 
VALUES ('post_00-00-03','title',NOW() - INTERVAL '4 day');

INSERT INTO posts ("beehivId", title, "publishedAt") 
VALUES ('post_00-00-04','title',NOW() - INTERVAL '5 day');

INSERT INTO posts ("beehivId", title, "publishedAt") 
VALUES ('post_00-00-05','title',NOW() - INTERVAL '6 day');


INSERT INTO reads ("userId","postId","createdAt") 
VALUES (1,1, NOW());

INSERT INTO reads ("userId","postId","createdAt") 
VALUES (1,2, NOW() - INTERVAL '1 day');



INSERT INTO reads ("userId","postId","createdAt","utmSource", "utmMedium", "utmCampaign", "utmChannel")
VALUES (3,2, NOW() - INTERVAL '1 day','tiktok', 'socialpaid','12/12/2024','web');

INSERT INTO reads ("userId","postId","createdAt","utmSource", "utmMedium", "utmCampaign", "utmChannel") 
VALUES (3,4, NOW() - INTERVAL '3 day','facebook', 'socialpaid','12/12/2024','web');

INSERT INTO reads ("userId","postId","createdAt","utmSource", "utmMedium", "utmCampaign", "utmChannel") 
VALUES (3,5, NOW() - INTERVAL '4 day','tiktok', 'socialpaid','12/12/2024','web');


INSERT INTO reads ("userId","postId","createdAt","utmSource", "utmMedium", "utmCampaign", "utmChannel") 
VALUES (4,1, NOW() - INTERVAL '2 day','facebook', 'socialpaid','12/12/2024','web');

INSERT INTO reads ("userId","postId","createdAt","utmSource", "utmMedium", "utmCampaign", "utmChannel") 
VALUES (4,2, NOW() - INTERVAL '3 day','email', null,'12/12/2024','web');

INSERT INTO reads ("userId","postId","createdAt","utmSource", "utmMedium", "utmCampaign", "utmChannel") 
VALUES (4,3, NOW() - INTERVAL '4 day','tiktok', 'socialpaid','13/12/2024','web');

INSERT INTO reads ("userId","postId","createdAt","utmSource", "utmMedium", "utmCampaign", "utmChannel") 
VALUES (4,4, NOW() - INTERVAL '5 day','facebook', 'socialpaid','13/12/2024','web');


INSERT INTO reads ("userId","postId","createdAt","utmSource", "utmMedium", "utmCampaign", "utmChannel") 
VALUES (5, 1, NOW() - INTERVAL '1 day','tiktok', null,'13/12/2024','web');

INSERT INTO reads ("userId","postId","createdAt","utmSource", "utmMedium", "utmCampaign", "utmChannel") 
VALUES (5, 2, NOW() - INTERVAL '1 day','instagram', 'socialpaid','14/12/2024','web');

INSERT INTO reads ("userId","postId","createdAt","utmSource", "utmMedium", "utmCampaign", "utmChannel") 
VALUES (5, 3, NOW() - INTERVAL '2 day','instagram', 'socialpaid','14/12/2024','web');

INSERT INTO reads ("userId","postId","createdAt","utmSource", "utmMedium", "utmCampaign", "utmChannel") 
VALUES (5, 5, NOW() - INTERVAL '4 day','tiktok', 'socialpaid','12/12/2024','web');


INSERT INTO reads ("userId","postId","createdAt","utmSource", "utmMedium", "utmCampaign", "utmChannel") 
VALUES (6, 5, NOW() - INTERVAL '4 day','tiktok', 'socialpaid','12/12/2024','web');


