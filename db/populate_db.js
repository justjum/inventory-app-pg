
const { Client } = require("pg");
const dotenv = require('dotenv');
const { argv } = require('node:process')

dotenv.config();

console.log(
    'This script populates some test items, categories, and brands. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // SQL Data to insert into script at end
  const SQL = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 )
  );

    CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ),
    website VARCHAR ( 255 )
  );

    CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_id INT,
    brand_id INT,
    model VARCHAR (100),
    description VARCHAR (255),
    price FLOAT,
    image VARCHAR (255),
    image_alt VARCHAR (127),
    quantity INTEGER NOT NULL,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES brands(id)
  );
  
    INSERT INTO brands (name, website) 
    VALUES
    ('Maton', 'https://maton.com.au/'),
    ('Fender', 'https://www.gibson.com'),
    ('Gibson', 'https://www.fender.com'),
    ('Eastman', 'https://www.eastmanguitars.com'),
    ('Yamaha', 'https://au.yamaha.com');

    INSERT INTO categories (name) 
    VALUES
    ('Acoustic'),
    ('Electric'),
    ('Bass'),
    ('Ukulele');
`;

const SQLITEMS = `
    INSERT INTO items (category_id, brand_id, model, description, price, image, image_alt, quantity) 
    VALUES 
    (
    (SELECT id FROM categories WHERE name = 'Acoustic'), 
    (SELECT id FROM brands WHERE name = 'Maton'), 
    'EC-335', 
    'A mighty fine acoustic', 
    1500, 
    'https://res.cloudinary.com/dhz7ys7e1/image/upload/t_Music%20Store%20Image/v1721167189/maton_xjzkkl.png', 
    'Maton Acoustic', 
    3
    ),
    (
    (SELECT id FROM categories WHERE name = 'Electric'), 
    (SELECT id FROM brands WHERE name = 'Gibson'), 
    'Vintage SG', 
    'A classic. Worth more than your car.', 
    15000, 
    'https://res.cloudinary.com/dhz7ys7e1/image/upload/t_Music%20Store%20Image/v1721167179/gibson_hcaxnr.jpg', 
    'Gibson SG', 
    1
    ),
        (
    (SELECT id FROM categories WHERE name = 'Electric'), 
    (SELECT id FROM brands WHERE name = 'Fender'), 
    'Stratocaster', 
    'Versatile. A classic.', 
    2500, 
    'https://res.cloudinary.com/dhz7ys7e1/image/upload/t_Music%20Store%20Image/v1721167189/stratocaster_jvn0b7.jpg', 
    'Fender Stratocaster', 
    4
    ),
        (
    (SELECT id FROM categories WHERE name = 'Acoustic'), 
    (SELECT id FROM brands WHERE name = 'Fender'), 
    'FA 125CE', 
    'The single-cutaway FA-125CE combines Fender tone and style with our FE-A2 electronics for a guitar that was made to take the stage.', 
    1250, 
    'https://res.cloudinary.com/dhz7ys7e1/image/upload/t_Music%20Store%20Image/v1721167178/fender-acoustic_yizzfc.jpg', 
    'Fender Acoustic', 
    5
    ),
        (
    (SELECT id FROM categories WHERE name = 'Electric'), 
    (SELECT id FROM brands WHERE name = 'Fender'), 
    'Telecaster', 
    'Bold, innovative and rugged, the Player Telecaster is pure Fender, through and through.', 
    2250, 
    'https://res.cloudinary.com/dhz7ys7e1/image/upload/t_Music%20Store%20Image/v1721167178/fender-telecaster_jt77ct.jpg', 
    'Fender Telecaster', 
    1
    ),
        (
    (SELECT id FROM categories WHERE name = 'Acoustic'), 
    (SELECT id FROM brands WHERE name = 'Eastman'), 
    'Night Acoustic', 
    'Want to look like Johnny Cash? Go with this badboy.', 
    500, 
    'https://res.cloudinary.com/dhz7ys7e1/image/upload/t_Music%20Store%20Image/v1721167178/eastman-acoustic_dbbiun.jpg', 
    'Black Eastman Acoustic', 
    6
    ),
        (
    (SELECT id FROM categories WHERE name = 'Electric'), 
    (SELECT id FROM brands WHERE name = 'Eastman'), 
    'Tweety', 
    'This thing is pretty. Like, reaaaal pretty.', 
    850, 
   'https://res.cloudinary.com/dhz7ys7e1/image/upload/t_Music%20Store%20Image/v1721167178/eastman_gi17uy.jpg', 
    'Red Eastman Hollow Body', 
    1
    ),
        (
    (SELECT id FROM categories WHERE name = 'Bass'), 
    (SELECT id FROM brands WHERE name = 'Fender'), 
    'Jazz Bass', 
    'Right here you''ll be slappin'' da bass. Ooooh, yeah.', 
    1150, 
   'https://res.cloudinary.com/dhz7ys7e1/image/upload/t_Music%20Store%20Image/v1721167190/jazzbass_clncbt.png', 
    'Fender Jazz Bass', 
    1
    ),
    (
    (SELECT id FROM categories WHERE name = 'Acoustic'), 
    (SELECT id FROM brands WHERE name = 'Yamaha'), 
    'Classical', 
    'For those players with a nylon persuasion.', 
    300, 
    'https://res.cloudinary.com/dhz7ys7e1/image/upload/t_Music%20Store%20Image/v1721167189/yamaha-classical_ts6lq6.jpg', 
    'Yamaha Classic Guitar', 
    1
    ),
    (
    (SELECT id FROM categories WHERE name = 'Ukulele'), 
    (SELECT id FROM brands WHERE name = 'Yamaha'), 
    'Little Fly', 
    'Ukuleleeeeeeeeee.', 
    150, 
    'https://res.cloudinary.com/dhz7ys7e1/image/upload/t_Music%20Store%20Image/v1721167190/yamaha-ukulele_yqoyqj.jpg', 
    'Yamaha Ukulele', 
    1
    ),
    (
    (SELECT id FROM categories WHERE name = 'Bass'), 
    (SELECT id FROM brands WHERE name = 'Yamaha'), 
    'TRBX-174', 
    'Hmmm, yup. More bass.', 
    750, 
    'https://res.cloudinary.com/dhz7ys7e1/image/upload/t_Music%20Store%20Image/v1721167189/yamaha-bass_ofmlvv.jpg', 
    'Yamaha Bass Guitar', 
    1
    )
    ;`

  ;



  

//((SELECT id FROM categories WHERE name = <category>), SELECT id FROM brands WHERE name = <brand>), <model>, <description>, <price>, <image>, <image_alt>, <quantity>),





  async function main() {
    console.log("seeding "+(argv[2]==='production' ? 'to production': 'locally'));
    console.log(argv[2])
    const client = new Client({
      connectionString: argv[2]==='production' ? process.env.PRODCONNECT : process.env.LOCALCONNECT
    });
    await client.connect();
    //await client.query(SQL);
    await client.query(SQLITEMS);
    await client.end();
    console.log("done");
  }
  
  main();