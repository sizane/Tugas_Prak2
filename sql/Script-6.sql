USE review_kantin;
GO

-- ---------------------------------------------------------------- USERS
INSERT INTO dbo.USERS (name, email, password_hash, role) VALUES
('Admin Kantin',   'admin@kantin.test',   'hash_admin_001',   'admin'),
('Budi Santoso',   'budi@kantin.test',    'hash_owner_001',   'owner'),
('Siti Aminah',    'siti@kantin.test',    'hash_owner_002',   'owner'),
('Rangga Pratama', 'rangga@student.test', 'hash_customer_001','customer'),
('Dewi Lestari',   'dewi@student.test',   'hash_customer_002','customer'),
('Fajar Nugroho',  'fajar@student.test',  'hash_customer_003','customer');
GO

-- --------------------------------------------------------------- STALLS
-- owner_id references USERS.id — Budi (2) and Siti (3) own stalls
INSERT INTO dbo.STALLS (owner_id, name, category, location, description, avg_rating, review_count) VALUES
(2, 'Warteg Bahagia',    'Nasi & Lauk',  'Blok A - Lantai 1', 'Menu rumahan, porsi besar',        0, 0),
(2, 'Mie Ayam Pak Budi', 'Mie',          'Blok A - Lantai 1', 'Mie ayam dan bakso khas Solo',      0, 0),
(3, 'Sate Bu Siti',      'Sate',         'Blok B - Lantai 2', 'Sate ayam dan kambing',             0, 0),
(3, 'Juice Corner',      'Minuman',      'Blok B - Lantai 2', 'Aneka jus buah segar',              0, 0),
(2, 'Nasi Goreng 24 Jam','Nasi Goreng',  'Blok A - Lantai 1', 'Buka 24 jam, cocok untuk begadang', 0, 0);
GO

-- ----------------------------------------------------------- MENU_ITEMS
-- stall_id references STALLS.id (1..5 in insertion order above)
INSERT INTO dbo.MENU_ITEMS (stall_id, name, price, is_available) VALUES
(1, 'Nasi + Ayam Goreng',      15000, 1),
(1, 'Nasi + Tempe Orek',       10000, 1),
(2, 'Mie Ayam Bakso',          13000, 1),
(2, 'Mie Ayam Jumbo',          17000, 1),
(3, 'Sate Ayam 10 Tusuk',      20000, 1),
(3, 'Sate Kambing 10 Tusuk',   25000, 0),
(4, 'Jus Alpukat',             12000, 1),
(4, 'Jus Mangga',              10000, 1),
(5, 'Nasi Goreng Spesial',     18000, 1);
GO

-- -------------------------------------------------------------- REVIEWS
-- stall_id references STALLS.id, user_id references USERS.id (customers: 4,5,6)
INSERT INTO dbo.REVIEWS (stall_id, user_id, rating, comment, like_count) VALUES
(1, 4, 5, 'Porsinya banyak, harga terjangkau!',        2),
(1, 5, 4, 'Enak tapi agak lama nunggunya.',            0),
(2, 6, 5, 'Mie ayam terbaik di kantin ini.',           3),
(3, 4, 4, 'Satenya juara, bumbunya mantap.',           1),
(4, 5, 3, 'Jusnya enak tapi kadang kurang segar.',     0),
(5, 6, 5, 'Andalan kalau lapar tengah malam.',         1);
GO

-- Sync avg_rating & review_count on STALLS based on the reviews above
UPDATE s
SET review_count = agg.cnt,
    avg_rating   = agg.avg_r
FROM dbo.STALLS s
JOIN (
    SELECT stall_id, COUNT(*) AS cnt, AVG(CAST(rating AS DECIMAL(3,2))) AS avg_r
    FROM dbo.REVIEWS
    GROUP BY stall_id
) agg ON agg.stall_id = s.id;
GO

-- ---------------------------------------------------------------- LIKES
-- review_id references REVIEWS.id (1..6 in insertion order above), user_id references USERS.id
INSERT INTO dbo.LIKES (review_id, user_id) VALUES
(1, 5),
(1, 6),
(3, 4),
(3, 5),
(4, 6),
(6, 4);
GO

-- ---------------------------------------------------------------- FLAGS
-- review_id references REVIEWS.id, reported_by references USERS.id
INSERT INTO dbo.FLAGS (review_id, reported_by, reason, status) VALUES
(2, 6, 'Komentar dianggap tidak relevan',     'pending'),
(5, 4, 'Diduga review palsu',                 'pending'),
(3, 5, 'Spam / promosi tersembunyi',          'dismissed'),
(6, 5, 'Bahasa kasar',                        'resolved'),
(1, 6, 'Duplikat review',                     'pending');
GO

-- ----------------------------------------------------------- AUDIT_LOGS
-- user_id references USERS.id
INSERT INTO dbo.AUDIT_LOGS (user_id, action, target_table, target_id, metadata) VALUES
(1, 'UPDATE_STATUS', 'FLAGS',   4, '{"old_status":"pending","new_status":"resolved"}'),
(1, 'DELETE',        'REVIEWS', 99,'{"reason":"removed by admin"}'),
(2, 'CREATE',        'STALLS',  1, '{"name":"Warteg Bahagia"}'),
(3, 'CREATE',        'STALLS',  3, '{"name":"Sate Bu Siti"}'),
(4, 'CREATE',        'REVIEWS', 1, '{"stall_id":1,"rating":5}');
GO

-- ------------------------------------------------------------- VERIFY
SELECT 'USERS' AS tabel, COUNT(*) AS jumlah FROM dbo.USERS
UNION ALL SELECT 'STALLS', COUNT(*) FROM dbo.STALLS
UNION ALL SELECT 'MENU_ITEMS', COUNT(*) FROM dbo.MENU_ITEMS
UNION ALL SELECT 'REVIEWS', COUNT(*) FROM dbo.REVIEWS
UNION ALL SELECT 'LIKES', COUNT(*) FROM dbo.LIKES
UNION ALL SELECT 'FLAGS', COUNT(*) FROM dbo.FLAGS
UNION ALL SELECT 'AUDIT_LOGS', COUNT(*) FROM dbo.AUDIT_LOGS;
GO