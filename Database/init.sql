-- PostgreSQL database initialization script

-- Set default tablespace
SET default_tablespace = '';

-- Create tables
CREATE TABLE public.item (
    item_id integer NOT NULL,
    item_name text,
    supermarket_id integer,
    item_cost numeric(10,2),
    promotion_id integer,
    promotion_type integer,
    item_photo_url text
);

CREATE TABLE public.shared_order (
    order_id integer NOT NULL,
    host_email text,
    order_confirmed boolean,
    time_confirmed timestamp
);

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_email text,
    item_id integer,
    item_quantity integer
);

CREATE TABLE public.user (
    user_email text NOT NULL,
    user_firstname text,
    user_lastname text,
    primary_user boolean,
    order_confirmed boolean
);

-- Populate the database with dummy data
INSERT INTO public.item (item_id, item_name, supermarket_id, item_cost, promotion_id, promotion_type, item_photo_url) VALUES
(47, 'milk', 2, 2.50, 0, 0, 'https://www.xx.com'),
(23, 'eggs', 5, 4.00, 1, 10, 'https://www.yy.co.uk'),
(19, 'bread', 3, 5.75, 10, 101, 'https://www.zz.com');

INSERT INTO public.shared_order (order_id, host_email, order_confirmed, time_confirmed) VALUES
(0, 'sxp1114@student.bham.ac.uk', false, NULL);

INSERT INTO public.orders (order_id, user_email, item_id, item_quantity) VALUES
(0, 'sxp1114@student.bham.ac.uk', 47, 5),
(0, 'sxp1114@student.bham.ac.uk', 23, 2),
(0, 'exw358@student.bham.ac.uk', 19, 6);

INSERT INTO public.user (user_email, user_firstname, user_lastname, primary_user, order_confirmed) VALUES
('sxp1114@student.bham.ac.uk', 'Sonali', 'Patel', true, false),
('hxr332@student.bham.ac.uk', 'Hannah', 'Rowe', false, false),
('agb194@student.bham.ac.uk', 'Alex', 'Burnet', false, false),
('exw358@student.bham.ac.uk', 'Ethan', 'Wright', false, false);

-- Add primary and foreign keys
ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (item_id);

ALTER TABLE ONLY public.shared_order
    ADD CONSTRAINT shared_order_pkey PRIMARY KEY (order_id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id, user_email, item_id);

ALTER TABLE ONLY public.user
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_email);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.item(item_id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_email_id_fkey FOREIGN KEY (user_email) REFERENCES public.user(user_email);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_id_fkey FOREIGN KEY (order_id) REFERENCES public.shared_order(order_id);

ALTER TABLE ONLY public.shared_order
    ADD CONSTRAINT shared_order_host_email_fkey FOREIGN KEY (host_email) REFERENCES public.user(user_email);
