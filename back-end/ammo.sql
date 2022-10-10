DROP DATABASE IF EXISTS eft_ammo;
CREATE DATABASE eft_ammo;

DROP TABLE IF EXISTS guns;
DROP TABLE IF EXISTS ammo;
DROP TABLE IF EXISTS caliber;


CREATE TABLE caliber (
    caliber_id int GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(20),
    PRIMARY KEY(caliber_id)
);


CREATE TABLE guns (
    guns_id int GENERATED ALWAYS AS IDENTITY,
    gun_name VARCHAR(30),
    caliber_id int,
    PRIMARY KEY(guns_id),
    CONSTRAINT fk_caliber
        FOREIGN KEY(caliber_id)
            REFERENCES caliber(caliber_id)
            ON DELETE CASCADE
);


CREATE TABLE ammo (
    ammo_id int GENERATED ALWAYS AS IDENTITY,
    ammo_name VARCHAR(30),
    effective VARCHAR(30),
    caliber_id int,
    PRIMARY KEY(ammo_id),
    CONSTRAINT fk_caliber
        FOREIGN KEY(caliber_id)
            REFERENCES caliber(caliber_id)
            ON DELETE CASCADE
);



INSERT INTO caliber (name) VALUES
('12 Guage Shot'),
('12 Guage Slug'),
('20 Guage'),
('23x75mm'),
('9x18mm'),
('7.62x25mm'),
('9x19mm'),
('.45'),
('9x21mm'),
('.357 Magnum'),
('5.7x28mm'),
('4.6x30mm'),
('9x39mm'),
('.366'),
('5.45x39mm'),
('5.56x45mm'),
('7.62x39mm'),
('.300 blk'),
('7.62x51mm'),
('7.62x54R'),
('12.7x55mm'),
('.338');

INSERT INTO guns (gun_name, caliber_id) VALUES
('MCX', 18),
('M4A1', 16),
('ADAR 2-15', 16),
('HK G36', 16),
('HK 416A5', 16),
('AK-105', 15),
('AK-74', 15),
('AKS-74', 15),
('SCAR-L', 16),
('AKM', 17),
('Mk47', 17),
('SCAR-H', 19),
('ASH-12', 21),
('MP7', 12),
('KS-23M', 4),
('Mk-18', 22);

INSERT INTO ammo (ammo_name, effective, caliber_id) VALUES 
('FLECHETTE', 'CLASS 6', 1),
('AP-20', 'CLASS 6', 2),
('DEVASTATOR', 'FLESH', 3),
('SHRAP-10', 'FLESH', 4),
('PM SP7 GZH', 'FLESH', 5),
('TT PST GZH', 'CLASS 3', 6),
('RIP', 'FLESH', 7),
('PBP GZH', 'CLASS 6', 7),
('ACP AP', 'CLASS 5', 8),
('BT GZH', 'CLASS 6', 9),
('FMJ', 'CLASS 3', 10),
('SS190', 'CLASS 6', 11),
('AP SX', 'CLASS 6', 12),
('BP GS', 'CLASS 6', 13),
('TKM AP-M', 'CLASS 6', 14),
('BT GS', 'CLASS 5', 15),
('BS GS', 'CLASS 6', 15),
('PPBS GS "IGOLNIK"', 'CLASS 6', 15),
('M855A1', 'CLASS 6', 16),
('M995', 'CLASS 6', 16),
('SSA AP', 'CLASS 6', 16),
('BP GZH', 'CLASS 6', 17),
('MAI AP', 'CLASS 6', 17),
('BLACKOUT AP', 'CLASS 6', 18),
('M61', 'CLASS 6', 19),
('M993', 'CLASS 6', 19),
('SNB GZH', 'CLASS 6', 20),
('LPS GZH', 'CLASS 5', 20),
('PS12B', 'CLASS 6', 21),
('FMJ', 'CLASS 6', 22),
('AP', 'CLASS 6', 22);





