-- PostgreSQL Database Initialization Script

-- Set default tablespace
SET default_tablespace = '';

-- ===============================
-- Table Definitions
-- ===============================

-- Users Table
CREATE TABLE public.user (
    user_email TEXT PRIMARY KEY,
    user_firstname TEXT,
    user_lastname TEXT,
    primary_user BOOLEAN,
    order_confirmed BOOLEAN
);

-- Items Table
CREATE TABLE public.item (
    item_id SERIAL PRIMARY KEY,
    item_name TEXT NOT NULL,
    supermarket_id INTEGER,
    item_cost NUMERIC(10, 2),
    promotion_id INTEGER,
    promotion_type INTEGER,
    item_photo_url TEXT,
    descriptions TEXT
);

-- Shared Orders Table
CREATE TABLE public.shared_order (
    order_id SERIAL PRIMARY KEY,
    host_email TEXT,
    order_confirmed BOOLEAN,
    time_confirmed TIMESTAMP,
    CONSTRAINT fk_host_email FOREIGN KEY (host_email) REFERENCES public.user(user_email)
);

-- Orders Table
CREATE TABLE public.orders (
    order_id INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    item_quantity INTEGER NOT NULL,
    PRIMARY KEY (order_id, user_email, item_id),
    CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES public.item(item_id),
    CONSTRAINT fk_user_email FOREIGN KEY (user_email) REFERENCES public.user(user_email),
    CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES public.shared_order(order_id)
);

-- ===============================
-- Insert Dummy Data
-- ===============================

-- Insert Users
INSERT INTO public.user (user_email, user_firstname, user_lastname, primary_user, order_confirmed) VALUES
    ('sxp1114@student.bham.ac.uk', 'Sonali', 'Patel', TRUE, FALSE),
    ('hxr332@student.bham.ac.uk', 'Hannah', 'Rowe', FALSE, FALSE),
    ('agb194@student.bham.ac.uk', 'Alex', 'Burnet', FALSE, FALSE),
    ('exw358@student.bham.ac.uk', 'Ethan', 'Wright', FALSE, FALSE);

-- Insert Items (Ensure items exist before inserting orders)
INSERT INTO public.item (item_id, item_name, supermarket_id, item_cost, promotion_id, promotion_type, item_photo_url, descriptions) VALUES
    (47, 'milk', 2, 2.50, 0, 0, 'https://pngimg.com/d/milk_PNG12734.png', 'Fresh whole milk, 1L carton'),
    (23, 'eggs', 5, 4.00, 1, 10, 'https://pngimg.com/d/egg_PNG97975.png', 'Free-range eggs, dozen pack'),
    (19, 'bread', 3, 5.75, 0, 0, 'https://png.pngtree.com/png-vector/20240128/ourmid/pngtree-bakery-bread-milky-plain-white-bread-png-image_11503244.png', 'Whole grain bread, 500g'),
    (22, 'milk chocolate', 6, 1.90, 5, 50, 'https://static.vecteezy.com/system/resources/previews/025/065/293/non_2x/chocolate-with-ai-generated-free-png.png', 'Smooth milk chocolate bar, 100g'),
    (30, 'butter', 2, 3.50, 0, 0, 'https://purepng.com/public/uploads/large/purepng.com-butterfood-dairy-milk-butter-buttermilk-cream-butterfat-941524621398zsmge.png', 'Salted butter, 250g'),
    (31, 'orange juice', 4, 3.00, 0, 0, 'https://static.vecteezy.com/system/resources/previews/027/309/417/non_2x/orange-juice-with-ai-generated-free-png.png', 'Freshly squeezed orange juice, 1L'),
    (32, 'cheddar cheese', 3, 5.00, 2, 20, 'https://static.vecteezy.com/system/resources/thumbnails/047/601/343/small_2x/stack-of-sliced-cheddar-cheese-cut-out-stock-png.png', 'Mature cheddar cheese, 200g block'),
    (33, 'apples', 1, 2.75, 0, 0, 'https://png.pngtree.com/png-vector/20231015/ourmid/pngtree-red-apples-png-png-image_10163259.png', 'Crisp green apples, 1kg bag'),
    (34, 'bananas', 1, 1.50, 0, 0, 'https://pngimg.com/d/banana_PNG842.png', 'Ripe bananas, 1kg bunch'),
    (35, 'crisps', 7, 1.00, 3, 10, 'https://static.vecteezy.com/system/resources/thumbnails/034/467/950/small_2x/chips-crisps-potato-chips-potato-crisps-potato-crackers-chips-transparent-background-chips-without-background-ai-generated-png.png', 'Sea salt crisps, 50g pack'),
    (36, 'pasta', 2, 2.20, 0, 0, 'https://pngimg.com/d/pasta_PNG74.png', 'Durum wheat pasta, 500g'),
    (37, 'tomato sauce', 2, 2.00, 0, 0, 'https://static.vecteezy.com/system/resources/previews/034/763/588/non_2x/ai-generated-pasta-with-tomato-sauce-in-a-bowl-free-png.png', 'Rich tomato pasta sauce, 400g jar'),
    (38, 'coffee', 6, 4.50, 4, 15, 'https://static.vecteezy.com/system/resources/previews/037/747/925/non_2x/ai-generated-falling-coffee-beans-free-png.png', 'Instant coffee, 200g jar'),
    (39, 'tea bags', 5, 3.00, 0, 0, 'https://png.pngtree.com/png-clipart/20211017/original/pngtree-tea-bag-tea-lifestyle-photography-still-life-png-image_6856075.png', 'Black tea bags, 100 pack'),
    (40, 'sugar', 1, 1.20, 0, 0, 'https://static.vecteezy.com/system/resources/previews/045/828/311/non_2x/stack-of-salt-free-png.png', 'White granulated sugar, 1kg bag'),
    (41, 'flour', 1, 1.00, 0, 0, 'https://png.pngtree.com/png-vector/20240331/ourmid/pngtree-pile-of-wheat-flour-and-rolling-pin-soft-flour-pile-pastry-png-image_12073143.png', 'Plain white flour, 1kg bag'),
    (42, 'chicken breast', 8, 6.00, 0, 0, 'https://static.vecteezy.com/system/resources/previews/041/454/582/non_2x/ai-generated-a-piece-of-raw-chicken-breast-isolated-on-transparent-background-free-png.png', 'Fresh chicken breast fillets, 500g'),
    (43, 'fish fingers', 8, 3.50, 1, 10, 'https://static.vecteezy.com/system/resources/thumbnails/039/373/622/small_2x/ai-generated-fish-fingers-creamed-with-mayonnaise-png.png', 'Breaded fish fingers, 10 pack'),
    (44, 'cereal', 3, 3.80, 0, 0, 'https://static.vecteezy.com/system/resources/previews/048/111/985/non_2x/bowl-of-cereal-free-png.png', 'Cornflakes cereal, 500g box'),
    (45, 'yogurt', 5, 2.50, 0, 0, 'https://png.pngtree.com/png-vector/20240224/ourmid/pngtree-greek-yogurt-with-fresh-blueberries-and-basil-leaves-isolated-on-white-png-image_11871064.png', 'Low-fat natural yogurt, 500g tub'),
    (46, 'frozen pizza', 9, 4.50, 0, 0, 'https://static.vecteezy.com/system/resources/previews/024/589/160/non_2x/top-view-pizza-with-ai-generated-free-png.png', 'Margherita frozen pizza, 300g');

-- Insert Shared Orders
INSERT INTO public.shared_order (order_id, host_email, order_confirmed, time_confirmed) VALUES
    (0, 'sxp1114@student.bham.ac.uk', FALSE, NULL);

-- Insert Orders (Now references existing items and users)
INSERT INTO public.orders (order_id, user_email, item_id, item_quantity) VALUES
    (0, 'sxp1114@student.bham.ac.uk', 47, 5),
    (0, 'sxp1114@student.bham.ac.uk', 23, 2),
    (0, 'exw358@student.bham.ac.uk', 19, 6);