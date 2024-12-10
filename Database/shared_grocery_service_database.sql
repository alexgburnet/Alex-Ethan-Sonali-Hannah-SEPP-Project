CREATE USER sepp WITH PASSWORD 'sepp';

CREATE DATABASE shared_grocery_service OWNER sepp;

\connect shared_grocery_service

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: item; Type: TABLE; Schema: public; Owner: sepp
--

CREATE TABLE public.item (
    item_id integer NOT NULL,
    supermarket_id integer,
    item_cost numeric(10,2),
    promotion_id integer,
    promotion_type integer
);


ALTER TABLE public.item OWNER TO sepp;

--
-- Name: shared_order; Type: TABLE; Schema: public; Owner: sepp
--

CREATE TABLE public.shared_order (
    order_id integer NOT NULL,
    host_email text,
    order_confirmed boolean,
    time_confirmed timestamp,
);


ALTER TABLE public.shared_order OWNER TO sepp;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: sepp
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_email text,
    item_id integer,
    item_quantity integer
);


ALTER TABLE public.orders OWNER TO sepp;

--
-- Name: user; Type: TABLE; Schema: public; Owner: sepp
--

CREATE TABLE public."user" (
    user_email text NOT NULL,
    user_firstname text,
    user_lastname text,
);


ALTER TABLE public."user" OWNER TO sepp;

--
-- Data for Name: item; Type: TABLE DATA; Schema: public; Owner: sepp
--

COPY public.item (item_id, supermarket_id, item_cost, promotion_id, promotion_type) FROM stdin;
47	2	2.50	0	0
23	5	4.00	1	10
19	3	5.75	10	101
\.

--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: sepp
--

COPY public.orders (order_id, user_email, item_id, item_quantity) FROM stdin;
0	sxp1114@student.bham.ac.uk  47  5
0	sxp1114@student.bham.ac.uk  23  2
0	exw358@student.bham.ac.uk   19  6
\.


--
-- Data for Name: shared_order; Type: TABLE DATA; Schema: public; Owner: sepp
--

COPY public.shared_order (order_id, host_email, order_confirmed, time_confirmed) FROM stdin;
0	sxp1114@student.bham.ac.uk  0   0
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: sepp
--

COPY public."user" (user_email, user_firstname, user_lastname) FROM stdin;
sxp1114@student.bham.ac.uk	Sonali	Patel
hxr332@student.bham.ac.uk	Hannah	Rowe
agb194@student.bham.ac.uk	Alex	Burnet
exw358@student.bham.ac.uk	Ethan	Wright
\.


--
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: sepp
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (item_id);


--
-- Name: shared_order shared_order_pkey; Type: CONSTRAINT; Schema: public; Owner: sepp
--

ALTER TABLE ONLY public.shared_order
    ADD CONSTRAINT shared_order_pkey PRIMARY KEY (order_id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: sepp
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_email);

--
-- Name: user orders_pkey; Type: CONSTRAINT; Schema: public; Owner: sepp
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT order_pkey PRIMARY KEY (order_id, user_email, item_id);


--
-- Name: orders orders_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sepp
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.item(item_id);


--
-- Name: orders orders_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sepp
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_email_id_fkey FOREIGN KEY (user_email) REFERENCES public."user"(user_email);


--
-- Name: orders orders_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sepp
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_id_fkey FOREIGN KEY (order_id) REFERENCES public.shared_order(order_id);



--
-- Name: shared_order shared_order_host_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sepp
--

ALTER TABLE ONLY public.shared_order
    ADD CONSTRAINT shared_order_host_email_fkey FOREIGN KEY (host_email) REFERENCES public."user"(user_email);


--
-- PostgreSQL database dump complete
--

