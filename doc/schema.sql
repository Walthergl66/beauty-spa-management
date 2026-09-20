--
-- PostgreSQL database dump
--

\restrict MCdg8wpuE4ji2OROtP4lpHx5PM44tY44DwQxlNWAq4kHecQ7JYJ5Bw82qtVbyvc

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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

--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: appointments_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.appointments_status_enum AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED',
    'NO_SHOW'
);


--
-- Name: assistant_messages_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.assistant_messages_role_enum AS ENUM (
    'user',
    'assistant',
    'system'
);


--
-- Name: payments_method_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payments_method_enum AS ENUM (
    'EFECTIVO',
    'TRANSFERENCIA',
    'TARJETA'
);


--
-- Name: payments_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payments_status_enum AS ENUM (
    'REGISTRADO',
    'ANULADO'
);


--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.users_role_enum AS ENUM (
    'CLIENT',
    'EMPLOYEE',
    'ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appointments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    client_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    service_id uuid NOT NULL,
    status public.appointments_status_enum DEFAULT 'PENDING'::public.appointments_status_enum NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    total_price numeric(10,2) NOT NULL,
    notes text,
    cancellation_reason text,
    cancelled_at timestamp with time zone,
    cancelled_by_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: assistant_conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assistant_conversations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id character varying NOT NULL,
    title character varying(120),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: assistant_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assistant_messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    conversation_id uuid NOT NULL,
    role public.assistant_messages_role_enum NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: employee_schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_schedules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    employee_id uuid NOT NULL,
    day_of_week smallint NOT NULL,
    start_time character varying(10) DEFAULT '09:00'::character varying NOT NULL,
    end_time character varying(10) DEFAULT '18:00'::character varying NOT NULL,
    break_start character varying(10) DEFAULT '13:00'::character varying,
    break_end character varying(10) DEFAULT '14:00'::character varying,
    is_working_day boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: COLUMN employee_schedules.day_of_week; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.employee_schedules.day_of_week IS '0=Domingo, 1=Lunes, ..., 6=Sábado';


--
-- Name: employee_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_services (
    employee_id uuid NOT NULL,
    service_id uuid NOT NULL
);


--
-- Name: employees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employees (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    specialty character varying(150),
    bio text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    appointment_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    method public.payments_method_enum NOT NULL,
    status public.payments_status_enum DEFAULT 'REGISTRADO'::public.payments_status_enum NOT NULL,
    notes text,
    received_by_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: push_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.push_subscriptions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id character varying NOT NULL,
    endpoint text NOT NULL,
    p256dh text NOT NULL,
    auth text NOT NULL,
    user_agent text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    duration_minutes integer NOT NULL,
    price numeric(10,2) NOT NULL,
    category character varying(100),
    image_url character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(150) NOT NULL,
    "passwordHash" character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone character varying(30),
    role public.users_role_enum DEFAULT 'CLIENT'::public.users_role_enum NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    refresh_token_hash character varying(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: payments PK_197ab7af18c93fbb0c9b28b4a59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);


--
-- Name: assistant_messages PK_2e3cd3325f853089044baca6b77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assistant_messages
    ADD CONSTRAINT "PK_2e3cd3325f853089044baca6b77" PRIMARY KEY (id);


--
-- Name: appointments PK_4a437a9a27e948726b8bb3e36ad; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY (id);


--
-- Name: employee_services PK_673fd236e781ddb746dd590616a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_services
    ADD CONSTRAINT "PK_673fd236e781ddb746dd590616a" PRIMARY KEY (employee_id, service_id);


--
-- Name: push_subscriptions PK_757fc8f00c34f66832668dc2e53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT "PK_757fc8f00c34f66832668dc2e53" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: employee_schedules PK_a82f7aa2134e860b889d1cf78b3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_schedules
    ADD CONSTRAINT "PK_a82f7aa2134e860b889d1cf78b3" PRIMARY KEY (id);


--
-- Name: employees PK_b9535a98350d5b26e7eb0c26af4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY (id);


--
-- Name: services PK_ba2d347a3168a296416c6c5ccb2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY (id);


--
-- Name: assistant_conversations PK_ba3c0e4c991d8449c4c80dcc866; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assistant_conversations
    ADD CONSTRAINT "PK_ba3c0e4c991d8449c4c80dcc866" PRIMARY KEY (id);


--
-- Name: employees UQ_2d83c53c3e553a48dadb9722e38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "UQ_2d83c53c3e553a48dadb9722e38" UNIQUE (user_id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: appointments no_overlapping_appointments; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT no_overlapping_appointments EXCLUDE USING gist (employee_id WITH =, tstzrange(start_time, end_time) WITH &&) WHERE ((status <> 'CANCELLED'::public.appointments_status_enum));


--
-- Name: IDX_0008bdfd174e533a3f98bf9af1; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_0008bdfd174e533a3f98bf9af1" ON public.push_subscriptions USING btree (endpoint);


--
-- Name: IDX_181dbf3d004c121a870d81bcc3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_181dbf3d004c121a870d81bcc3" ON public.appointments USING btree (status, start_time);


--
-- Name: IDX_1834a95212d94c86b540273df4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_1834a95212d94c86b540273df4" ON public.employee_services USING btree (employee_id);


--
-- Name: IDX_32b41cdb985a296213e9a928b5; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_32b41cdb985a296213e9a928b5" ON public.payments USING btree (status);


--
-- Name: IDX_6771f119f1c06d2ccf38f23866; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_6771f119f1c06d2ccf38f23866" ON public.push_subscriptions USING btree (user_id);


--
-- Name: IDX_928903d4fdb5794b35c3349c26; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_928903d4fdb5794b35c3349c26" ON public.assistant_conversations USING btree (user_id, created_at);


--
-- Name: IDX_9f49987820da519f855d04c82b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_9f49987820da519f855d04c82b" ON public.payments USING btree (appointment_id);


--
-- Name: IDX_a6078baa573bf82a3c6ebe7769; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_a6078baa573bf82a3c6ebe7769" ON public.assistant_messages USING btree (conversation_id, created_at);


--
-- Name: IDX_d602a58d810a3dc2d7b8b12e66; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_d602a58d810a3dc2d7b8b12e66" ON public.appointments USING btree (employee_id, start_time, end_time);


--
-- Name: IDX_e7d87b2b1008a32e6940e7e46d; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_e7d87b2b1008a32e6940e7e46d" ON public.appointments USING btree (client_id, status);


--
-- Name: IDX_f19f9b60ab07ce81f9affcf797; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_f19f9b60ab07ce81f9affcf797" ON public.employee_services USING btree (service_id);


--
-- Name: employee_services FK_1834a95212d94c86b540273df4e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_services
    ADD CONSTRAINT "FK_1834a95212d94c86b540273df4e" FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: appointments FK_2a2088e8eaa8f28d8de2bdbb857; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "FK_2a2088e8eaa8f28d8de2bdbb857" FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE RESTRICT;


--
-- Name: employees FK_2d83c53c3e553a48dadb9722e38; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: appointments FK_5d7f9a1bfb534c4262aa5644f7c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "FK_5d7f9a1bfb534c4262aa5644f7c" FOREIGN KEY (cancelled_by_id) REFERENCES public.users(id);


--
-- Name: assistant_messages FK_97b4ef2a5d2a5dd3873486a5dad; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assistant_messages
    ADD CONSTRAINT "FK_97b4ef2a5d2a5dd3873486a5dad" FOREIGN KEY (conversation_id) REFERENCES public.assistant_conversations(id) ON DELETE CASCADE;


--
-- Name: payments FK_9f49987820da519f855d04c82bd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_9f49987820da519f855d04c82bd" FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE RESTRICT;


--
-- Name: appointments FK_ccc5bbce58ad6bc96faa428b1e4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "FK_ccc5bbce58ad6bc96faa428b1e4" FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: employee_schedules FK_e02e3472a9443d6fd21e7b3932b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_schedules
    ADD CONSTRAINT "FK_e02e3472a9443d6fd21e7b3932b" FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_services FK_f19f9b60ab07ce81f9affcf7974; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_services
    ADD CONSTRAINT "FK_f19f9b60ab07ce81f9affcf7974" FOREIGN KEY (service_id) REFERENCES public.services(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: appointments FK_f4e3a19c74dac65a223368fa9a0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "FK_f4e3a19c74dac65a223368fa9a0" FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;


--
-- Name: payments FK_fdb95dd85ac02027afaed80f139; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_fdb95dd85ac02027afaed80f139" FOREIGN KEY (received_by_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict MCdg8wpuE4ji2OROtP4lpHx5PM44tY44DwQxlNWAq4kHecQ7JYJ5Bw82qtVbyvc

