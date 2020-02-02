--
-- PostgreSQL database dump
--

-- Dumped from database version 11.6
-- Dumped by pg_dump version 11.6

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
-- Name: app_hidden; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_hidden;


--
-- Name: app_private; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_private;


--
-- Name: app_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_public;


--
-- Name: graphile_worker; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphile_worker;


--
-- Name: postgraphile_watch; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA postgraphile_watch;


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: email_verification_status; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.email_verification_status AS ENUM (
    'not_verified',
    'sent',
    'verified'
);


--
-- Name: email_verify_result; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.email_verify_result AS (
	message text,
	success boolean
);


--
-- Name: forgot_password_result; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.forgot_password_result AS (
	message text,
	success boolean
);


--
-- Name: media_type; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.media_type AS ENUM (
    'video',
    'audio'
);


--
-- Name: promo_code_status; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.promo_code_status AS ENUM (
    'active',
    'used',
    'canceled'
);


--
-- Name: purchase_status; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.purchase_status AS ENUM (
    'pending',
    'canceled',
    'paid'
);


--
-- Name: reset_password_result; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.reset_password_result AS (
	message text,
	success boolean
);


--
-- Name: send_verification_email_result; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.send_verification_email_result AS (
	message text,
	success boolean
);


--
-- Name: user_role; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.user_role AS ENUM (
    'member',
    'admin',
    'editor'
);


--
-- Name: user_status; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.user_status AS ENUM (
    'active',
    'blocked'
);


--
-- Name: create_code(integer, boolean); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.create_code(len integer DEFAULT 6, alpha boolean DEFAULT false) RETURNS text
    LANGUAGE plpgsql
    AS $$
declare
  v_serial text = '';
  v_i int;
  v_chars text = '0123456789';
begin
  if alpha then
    v_chars = v_chars || 'abcdefghijklmnopqrstuvwxyz';
  end if;
  for v_i in 1 .. len loop
      v_serial = v_serial || substr(v_chars, int4(random() * length(v_chars)), 1);
  end loop;
  return lower(v_serial);
end;
$$;


--
-- Name: new_open_message(); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.new_open_message() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'app_private'
    AS $$
declare
  v_payload json;
begin
  v_payload = json_build_object(
    'user', app_public.current_user(),
    'message', row_to_json(new)
  );
  perform graphile_worker.add_job('sendMessage', v_payload);
  return new;
end;
$$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: users; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.users (
    id integer NOT NULL,
    first_name character varying(32),
    last_name character varying(32),
    avatar character varying(255),
    email public.citext,
    facebook_id bigint,
    status app_public.user_status DEFAULT 'active'::app_public.user_status,
    password character varying(255),
    role app_public.user_role DEFAULT 'member'::app_public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: COLUMN users.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.users.id IS '@omit create,update';


--
-- Name: COLUMN users.status; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.users.status IS '@omit
0 active, 1 blocked';


--
-- Name: COLUMN users.password; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.users.password IS '@omit update,delete';


--
-- Name: COLUMN users.role; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.users.role IS '@omit create,update';


--
-- Name: change_user_role(integer, app_public.user_role); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.change_user_role(user_id integer, role app_public.user_role) RETURNS app_public.users
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'app_public'
    AS $_$
  update users set role=$2 where id=user_id returning *;
$_$;


--
-- Name: change_user_status(integer, app_public.user_status); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.change_user_status(user_id integer, status app_public.user_status) RETURNS app_public.users
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'app_public'
    AS $_$
  update users set status=$2 where id=user_id returning *;
$_$;


--
-- Name: promo_codes; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.promo_codes (
    code text NOT NULL,
    status app_public.promo_code_status DEFAULT 'active'::app_public.promo_code_status NOT NULL,
    percent integer DEFAULT 0 NOT NULL,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE promo_codes; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.promo_codes IS '@omit create';


--
-- Name: COLUMN promo_codes.code; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.promo_codes.code IS '@omit create,update
this also will be used as id';


--
-- Name: COLUMN promo_codes.percent; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.promo_codes.percent IS 'discount percent, default is 0';


--
-- Name: create_promo_code(integer, app_public.promo_code_status, timestamp with time zone); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.create_promo_code(percent integer, status app_public.promo_code_status DEFAULT 'active'::app_public.promo_code_status, expires_at timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS app_public.promo_codes
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'app_private', 'app_public'
    AS $_$
declare
  v_code text;
  v_promo_code promo_codes;
begin
  loop
    v_code = create_code(6, false);
    if not exists(select 1 from promo_codes where code=v_code) then
        insert into promo_codes(code, percent, status, expires_at)
          values (v_code, $1, $2, $3) returning * into v_promo_code;
        return v_promo_code;
    end if;
  end loop;
end;
$_$;


--
-- Name: create_promo_codes(integer, integer, app_public.promo_code_status, timestamp with time zone); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.create_promo_codes(count integer, percent integer, status app_public.promo_code_status DEFAULT 'active'::app_public.promo_code_status, expires_at timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS app_public.promo_codes[]
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    SET search_path TO 'app_private', 'app_public'
    AS $$
declare
  v_promo_codes promo_codes[] = array[]::promo_codes[];
  v_i int;
begin
  for v_i in 1..count loop
    perform append_array(v_promo_codes, create_promo_code(percent, promo_code_status, expires_at));
  end loop;
  return v_promo_codes;
end;
$$;


--
-- Name: current_user(boolean); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public."current_user"(not_null boolean DEFAULT true) RETURNS app_public.users
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'app_public'
    AS $$
  select * from users where id = current_user_id(not_null);
$$;


--
-- Name: current_user_id(boolean); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.current_user_id(not_null boolean DEFAULT false) RETURNS integer
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
    user_id integer = current_setting('user.id', true)::integer;
begin
    if not_null and user_id is null then
        raise exception 'You need to be logged in';
    end if;
    return user_id;
end;
$$;


--
-- Name: current_user_role(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.current_user_role() RETURNS app_public.user_role
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'app_public'
    AS $$
declare
  v_user users = app_public.current_user();
begin
  return v_user.role;
end;
$$;


--
-- Name: forgot_password(public.citext); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.forgot_password(email public.citext) RETURNS app_public.forgot_password_result
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'app_private', 'app_public'
    AS $_$
#variable_conflict use_column
declare
  v_reset_password reset_passwords;
  v_payload json;
begin
  if not exists(select 1 from users where email = $1) then
    return ('there is no user with that email', false);
  end if;
  insert into reset_passwords(email) values(email) returning * into v_reset_password;
  v_payload = json_build_object(
      'token', v_reset_password.id, 
      'email', v_reset_password.email, 
      'lang', current_setting('locale', false)
    );
  perform graphile_worker.add_job('sendResetLink', v_payload);
  return ('password reset link email have been sent', true)::forget_password_result;
end;
$_$;


--
-- Name: reset_password(text, text); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.reset_password(token text, password text) RETURNS app_public.reset_password_result
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'app_private', 'app_hidden'
    AS $_$
-- #variable_conflict use_column
declare
  v_max_old interval = interval '1 hour';
  v_max_attempts int = 3;
  v_reset_password reset_passwords;
begin
  update reset_passwords set attempts = attempts + 1
    where token=$1 returning * into v_reset_password;

  if v_reset_password.created_at + v_max_old > now() then
    return ('token has been expired, you can use it in one hour', false)::reset_password_result;
  end if;
  if v_reset_password.attempts > v_max_attempts then
    return ('too many attempts for this token', false)::reset_password_result;
  end if;

  update users set password = $2 where email = v_reset_password.email;
  return ('password have been changed', true)::reset_password_result;
end;
$_$;


--
-- Name: scores; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.scores (
    id integer NOT NULL,
    path character varying(255) NOT NULL,
    title character varying(255),
    description character varying(255),
    url character varying(255),
    prices jsonb,
    stamp_right character varying(12),
    stamp_center character varying(12),
    published boolean DEFAULT false NOT NULL,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    composition_id integer
);


--
-- Name: COLUMN scores.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.scores.id IS '@omit create,update';


--
-- Name: COLUMN scores.path; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.scores.path IS 'SEO friendly name to use in url';


--
-- Name: COLUMN scores.title; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.scores.title IS '@localize';


--
-- Name: COLUMN scores.description; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.scores.description IS '@localize';


--
-- Name: COLUMN scores.prices; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.scores.prices IS 'amount - currency pairs';


--
-- Name: COLUMN scores.stamp_right; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.scores.stamp_right IS 'Right side stamp page selection https://pdfcpu.io/getting_started/page_selection, ex. 1';


--
-- Name: COLUMN scores.stamp_center; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.scores.stamp_center IS 'Center side stamp page selection https://pdfcpu.io/getting_started/page_selection, ex. 2-';


--
-- Name: COLUMN scores.published_at; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.scores.published_at IS '@omit create
This is automatically changed if ''published'' changed, can be manually provided by ''admin''';


--
-- Name: scores_is_purchased(app_public.scores); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.scores_is_purchased(score app_public.scores) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'app_public'
    AS $$
begin
  return exists(
    select 1 from purchases where user_id=current_user_id() and score_id=score.id and status='paid'
  );
end;
$$;


--
-- Name: send_verification_email(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.send_verification_email() RETURNS app_public.send_verification_email_result
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'app_private', 'app_public'
    AS $$
declare
  v_user users = app_public.current_user();
  v_verification email_verifications;
  v_payload json;
begin
  if v_user.email is null then
    return ('account do not have email', false)::send_verification_email_result;
  end if;

  insert into email_verifications(user_id, email) 
    values(v_user.id, v_user.email)
    on conflict (user_id, email) do update set code = create_code()
    returning * into v_verification;
  
  v_payload = json_build_object(
    'id', v_verification.id,
    'email', v_user.email,
    'code', v_verification.code,
    'lang', current_setting('locale', false)
  );

  perform graphile_worker.add_job('sendVerificationEmail', v_payload);

  return ('code have been sent to email of this accont', true)::send_verification_email_result;
end;
$$;


--
-- Name: set_timestamps(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.set_timestamps() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
    v_now timestamp = now();
begin
    if tg_op = 'INSERT' then
        new.created_at = v_now;
        new.updated_at = v_now;
    else
        new.updated_at = v_now;
    end if;
    return v_new;
end;
$$;


--
-- Name: users_email_verification_status(app_public.users); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.users_email_verification_status(i_user app_public.users) RETURNS app_public.email_verification_status
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'app_private'
    AS $$
  select (
    case 
    when is_verified then 'verified'::app_public.email_verification_status
    when sib_message_id is not null then 'sent'::app_public.email_verification_status
    else 'not_verified'::app_public.email_verification_status
    end
  ) from email_verifications
    where user_id = i_user.id and email = i_user.email;
$$;


--
-- Name: verify_email(text); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.verify_email(code text) RETURNS app_public.email_verify_result
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'app_private', 'app_public'
    AS $_$
declare
  v_user users = app_public.current_user(true);
  v_verification email_verifications;
  v_max_attempts int = 3;
begin
  if v_user.email is null then
    return ('account do not have email', false);
  end if;

  update email_verifications set attempts = attempts + 1
    where email=v_user.email and user_id=v_user.id
    returning * into v_verification;

  if v_verification.attempts > v_max_attempts then
    return ('too many attempts you can try only ' || v_max_attempts || 'times', false);
  end if;

  if v_verification.code = $1 then
    return ('email is verified', true);
  end if;

  return ('invalid verification code', false)::email_verify_result;
end;
$_$;


--
-- Name: jobs; Type: TABLE; Schema: graphile_worker; Owner: -
--

CREATE TABLE graphile_worker.jobs (
    id bigint NOT NULL,
    queue_name text DEFAULT (public.gen_random_uuid())::text NOT NULL,
    task_identifier text NOT NULL,
    payload json DEFAULT '{}'::json NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    run_at timestamp with time zone DEFAULT now() NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    max_attempts integer DEFAULT 25 NOT NULL,
    last_error text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: add_job(text, json, text, timestamp with time zone, integer); Type: FUNCTION; Schema: graphile_worker; Owner: -
--

CREATE FUNCTION graphile_worker.add_job(identifier text, payload json DEFAULT '{}'::json, queue_name text DEFAULT (public.gen_random_uuid())::text, run_at timestamp with time zone DEFAULT now(), max_attempts integer DEFAULT 25) RETURNS graphile_worker.jobs
    LANGUAGE sql
    AS $$
  insert into graphile_worker.jobs(task_identifier, payload, queue_name, run_at, max_attempts) values(identifier, payload, queue_name, run_at, max_attempts) returning *;
$$;


--
-- Name: complete_job(text, bigint); Type: FUNCTION; Schema: graphile_worker; Owner: -
--

CREATE FUNCTION graphile_worker.complete_job(worker_id text, job_id bigint) RETURNS graphile_worker.jobs
    LANGUAGE plpgsql
    AS $$
declare
  v_row graphile_worker.jobs;
begin
  delete from graphile_worker.jobs
    where id = job_id
    returning * into v_row;

  update graphile_worker.job_queues
    set locked_by = null, locked_at = null
    where queue_name = v_row.queue_name and locked_by = worker_id;

  return v_row;
end;
$$;


--
-- Name: fail_job(text, bigint, text); Type: FUNCTION; Schema: graphile_worker; Owner: -
--

CREATE FUNCTION graphile_worker.fail_job(worker_id text, job_id bigint, error_message text) RETURNS graphile_worker.jobs
    LANGUAGE plpgsql
    AS $$
declare
  v_row graphile_worker.jobs;
begin
  update graphile_worker.jobs
    set
      last_error = error_message,
      run_at = greatest(now(), run_at) + (exp(least(attempts, 10))::text || ' seconds')::interval
    where id = job_id
    returning * into v_row;

  update graphile_worker.job_queues
    set locked_by = null, locked_at = null
    where queue_name = v_row.queue_name and locked_by = worker_id;

  return v_row;
end;
$$;


--
-- Name: get_job(text, text[], interval); Type: FUNCTION; Schema: graphile_worker; Owner: -
--

CREATE FUNCTION graphile_worker.get_job(worker_id text, task_identifiers text[] DEFAULT NULL::text[], job_expiry interval DEFAULT '04:00:00'::interval) RETURNS graphile_worker.jobs
    LANGUAGE plpgsql
    AS $$
declare
  v_job_id bigint;
  v_queue_name text;
  v_default_job_max_attempts text = '25';
  v_row graphile_worker.jobs;
begin
  if worker_id is null or length(worker_id) < 10 then
    raise exception 'invalid worker id';
  end if;

  select job_queues.queue_name, jobs.id into v_queue_name, v_job_id
    from graphile_worker.jobs
    inner join graphile_worker.job_queues using (queue_name)
    where (locked_at is null or locked_at < (now() - job_expiry))
    and run_at <= now()
    and attempts < max_attempts
    and (task_identifiers is null or task_identifier = any(task_identifiers))
    order by priority asc, run_at asc, id asc
    limit 1
    for update of job_queues
    skip locked;

  if v_queue_name is null then
    return null;
  end if;

  update graphile_worker.job_queues
    set
      locked_by = worker_id,
      locked_at = now()
    where job_queues.queue_name = v_queue_name;

  update graphile_worker.jobs
    set attempts = attempts + 1
    where id = v_job_id
    returning * into v_row;

  return v_row;
end;
$$;


--
-- Name: jobs__decrease_job_queue_count(); Type: FUNCTION; Schema: graphile_worker; Owner: -
--

CREATE FUNCTION graphile_worker.jobs__decrease_job_queue_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  v_new_job_count int;
begin
  update graphile_worker.job_queues
    set job_count = job_queues.job_count - 1
    where queue_name = old.queue_name
    returning job_count into v_new_job_count;

  if v_new_job_count <= 0 then
    delete from graphile_worker.job_queues where queue_name = old.queue_name and job_count <= 0;
  end if;

  return old;
end;
$$;


--
-- Name: jobs__increase_job_queue_count(); Type: FUNCTION; Schema: graphile_worker; Owner: -
--

CREATE FUNCTION graphile_worker.jobs__increase_job_queue_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  insert into graphile_worker.job_queues(queue_name, job_count)
    values(new.queue_name, 1)
    on conflict (queue_name)
    do update
    set job_count = job_queues.job_count + 1;

  return new;
end;
$$;


--
-- Name: tg__update_timestamp(); Type: FUNCTION; Schema: graphile_worker; Owner: -
--

CREATE FUNCTION graphile_worker.tg__update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = greatest(now(), old.updated_at + interval '1 millisecond');
  return new;
end;
$$;


--
-- Name: tg_jobs__notify_new_jobs(); Type: FUNCTION; Schema: graphile_worker; Owner: -
--

CREATE FUNCTION graphile_worker.tg_jobs__notify_new_jobs() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify('jobs:insert', '');
  return new;
end;
$$;


--
-- Name: notify_watchers_ddl(); Type: FUNCTION; Schema: postgraphile_watch; Owner: -
--

CREATE FUNCTION postgraphile_watch.notify_watchers_ddl() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'ddl',
      'payload',
      (select json_agg(json_build_object('schema', schema_name, 'command', command_tag)) from pg_event_trigger_ddl_commands() as x)
    )::text
  );
end;
$$;


--
-- Name: notify_watchers_drop(); Type: FUNCTION; Schema: postgraphile_watch; Owner: -
--

CREATE FUNCTION postgraphile_watch.notify_watchers_drop() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'drop',
      'payload',
      (select json_agg(distinct x.schema_name) from pg_event_trigger_dropped_objects() as x)
    )::text
  );
end;
$$;


--
-- Name: email_verifications; Type: TABLE; Schema: app_private; Owner: -
--

CREATE TABLE app_private.email_verifications (
    id integer NOT NULL,
    user_id integer,
    email public.citext NOT NULL,
    code text DEFAULT app_private.create_code() NOT NULL,
    is_verified boolean DEFAULT false,
    attempts integer DEFAULT 0 NOT NULL,
    sib_message_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: email_verifications_id_seq; Type: SEQUENCE; Schema: app_private; Owner: -
--

ALTER TABLE app_private.email_verifications ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_private.email_verifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reset_passwords; Type: TABLE; Schema: app_private; Owner: -
--

CREATE TABLE app_private.reset_passwords (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email text NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    is_expired boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: article_galleries; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.article_galleries (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: COLUMN article_galleries.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.article_galleries.id IS '@omit create,update';


--
-- Name: article_galleries_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.article_galleries ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.article_galleries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: article_gallery_images; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.article_gallery_images (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    gallery_id integer NOT NULL,
    image_id integer NOT NULL
);


--
-- Name: article_genres; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.article_genres (
    article_id integer NOT NULL,
    genre_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: article_images; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.article_images (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    article_id integer NOT NULL,
    image_id integer NOT NULL
);


--
-- Name: article_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.article_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    title character varying(255),
    description text,
    content text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: article_tags; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.article_tags (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    article_id integer NOT NULL,
    tag_id integer NOT NULL
);


--
-- Name: articles; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.articles (
    id integer NOT NULL,
    path character varying(255) NOT NULL,
    title character varying(255),
    description text,
    content text,
    published boolean DEFAULT false NOT NULL,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    author_id integer,
    updater_id integer,
    poster_id integer,
    gallery_id integer
);


--
-- Name: COLUMN articles.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.articles.id IS '@omit create,update';


--
-- Name: COLUMN articles.path; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.articles.path IS 'SEO friendly name to use in url';


--
-- Name: COLUMN articles.title; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.articles.title IS '@localize';


--
-- Name: COLUMN articles.description; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.articles.description IS '@localize';


--
-- Name: COLUMN articles.content; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.articles.content IS '@localize';


--
-- Name: COLUMN articles.published_at; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.articles.published_at IS '@omit create
This is automatically changed if ''published'' changed, can be manually provided by ''admin''.';


--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.articles ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.articles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: composition_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.composition_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    title character varying(255),
    description character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: compositions; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.compositions (
    id integer NOT NULL,
    path character varying(255),
    title character varying(255),
    description character varying(255),
    composing_start timestamp with time zone,
    composing_end timestamp with time zone,
    published boolean DEFAULT false NOT NULL,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: COLUMN compositions.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.compositions.id IS '@omit create,update';


--
-- Name: COLUMN compositions.path; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.compositions.path IS 'SEO friendly name to use in url';


--
-- Name: COLUMN compositions.title; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.compositions.title IS '@localize';


--
-- Name: COLUMN compositions.description; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.compositions.description IS '@localize';


--
-- Name: COLUMN compositions.published_at; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.compositions.published_at IS '@omit create
This is automatically changed if ''published'' changed, can be manually provided by ''admin''.';


--
-- Name: compositions_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.compositions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.compositions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: document_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.document_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    content text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: documents; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.documents (
    id integer NOT NULL,
    name character varying(32),
    content text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: COLUMN documents.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.documents.id IS '@omit create,update';


--
-- Name: COLUMN documents.content; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.documents.content IS '@localize';


--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.documents ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: genre_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.genre_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    name character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: genres; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.genres (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: COLUMN genres.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.genres.id IS '@omit create,update';


--
-- Name: COLUMN genres.name; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.genres.name IS '@localize';


--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.genres ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.genres_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: group_images; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.group_images (
    group_id integer NOT NULL,
    image_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: group_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.group_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    name character varying(255),
    biography text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: group_musicians; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.group_musicians (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    musician_id integer NOT NULL,
    group_id integer NOT NULL
);


--
-- Name: group_playlists; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.group_playlists (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    group_id integer NOT NULL,
    playlist_id integer NOT NULL
);


--
-- Name: groups; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.groups (
    id integer NOT NULL,
    founded timestamp with time zone,
    name character varying(255),
    biography text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    photo_id integer
);


--
-- Name: COLUMN groups.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.groups.id IS '@omit create,update';


--
-- Name: COLUMN groups.name; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.groups.name IS '@localize';


--
-- Name: COLUMN groups.biography; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.groups.biography IS '@localize';


--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: image_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.image_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    caption character varying(255),
    description character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: images; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.images (
    id integer NOT NULL,
    url character varying(255) NOT NULL,
    caption character varying(255),
    description character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: COLUMN images.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.images.id IS '@omit create,update';


--
-- Name: COLUMN images.caption; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.images.caption IS '@localize';


--
-- Name: COLUMN images.description; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.images.description IS '@localize';


--
-- Name: images_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.images ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: instrument_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.instrument_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    name character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: instruments; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.instruments (
    id integer NOT NULL,
    name character varying(255),
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: COLUMN instruments.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.instruments.id IS '@omit create,update';


--
-- Name: COLUMN instruments.name; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.instruments.name IS '@localize';


--
-- Name: instruments_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.instruments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.instruments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: languages; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.languages (
    code character varying(2) NOT NULL
);


--
-- Name: TABLE languages; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.languages IS '@omit update,delete';


--
-- Name: media; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.media (
    id integer NOT NULL,
    url character varying(255) NOT NULL,
    media_type app_public.media_type,
    title character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: COLUMN media.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.media.id IS '@omit create,update';


--
-- Name: COLUMN media.title; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.media.title IS '@localize';


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.media ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.media_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: media_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.media_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    title character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: musician_compositions; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.musician_compositions (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    composition_id integer NOT NULL,
    musician_id integer NOT NULL
);


--
-- Name: musician_genres; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.musician_genres (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    musician_id integer NOT NULL,
    genre_id integer NOT NULL
);


--
-- Name: musician_images; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.musician_images (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    image_id integer NOT NULL,
    musician_id integer NOT NULL
);


--
-- Name: musician_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.musician_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    description text,
    first_name character varying(255),
    last_name character varying(255),
    biography text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: musician_playlists; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.musician_playlists (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    musician_id integer NOT NULL,
    playlist_id integer NOT NULL
);


--
-- Name: musician_professions; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.musician_professions (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    musician_id integer NOT NULL,
    profession_id integer NOT NULL
);


--
-- Name: musician_tags; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.musician_tags (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    musician_id integer NOT NULL,
    tag_id integer NOT NULL
);


--
-- Name: musicians; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.musicians (
    id integer NOT NULL,
    path character varying(255) NOT NULL,
    birthday date,
    deathday date,
    type character varying(32) NOT NULL,
    description text,
    first_name character varying(255),
    last_name character varying(255),
    biography text,
    published boolean DEFAULT false NOT NULL,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    photo_id integer
);


--
-- Name: COLUMN musicians.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.musicians.id IS '@omit create,update';


--
-- Name: COLUMN musicians.path; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.musicians.path IS 'SEO friendly name to use in url';


--
-- Name: COLUMN musicians.description; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.musicians.description IS '@localize';


--
-- Name: COLUMN musicians.first_name; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.musicians.first_name IS '@localize';


--
-- Name: COLUMN musicians.last_name; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.musicians.last_name IS '@localize';


--
-- Name: COLUMN musicians.biography; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.musicians.biography IS '@localize';


--
-- Name: COLUMN musicians.published_at; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.musicians.published_at IS '@omit create
This is automatically changed if ''published'' changed, can be manually provided by ''admin''.';


--
-- Name: musicians_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.musicians ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.musicians_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: open_messages; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.open_messages (
    id integer NOT NULL,
    name text,
    email public.citext NOT NULL,
    message character varying(255) NOT NULL,
    attached_file text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE open_messages; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.open_messages IS 'Open message that anyone can send to support team.';


--
-- Name: COLUMN open_messages.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.open_messages.id IS '@omit create,update';


--
-- Name: COLUMN open_messages.email; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.open_messages.email IS '@omit update';


--
-- Name: open_messages_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.open_messages ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.open_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: page_sections; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.page_sections (
    page character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    attrs jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: playlist_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.playlist_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    name character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: playlist_media; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.playlist_media (
    index integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    media_id integer NOT NULL,
    playlist_id integer NOT NULL
);


--
-- Name: COLUMN playlist_media.index; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.playlist_media.index IS 'Order in playlist';


--
-- Name: playlists; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.playlists (
    id integer NOT NULL,
    is_public boolean DEFAULT false,
    name character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    owner_id integer
);


--
-- Name: COLUMN playlists.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.playlists.id IS '@omit create,update';


--
-- Name: COLUMN playlists.name; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.playlists.name IS '@localize';


--
-- Name: playlists_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.playlists ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.playlists_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profession_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.profession_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    name character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: professions; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.professions (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: COLUMN professions.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.professions.id IS '@omit create,update';


--
-- Name: COLUMN professions.name; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.professions.name IS '@localize';


--
-- Name: professions_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.professions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.professions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: purchases; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.purchases (
    id integer NOT NULL,
    status app_public.purchase_status DEFAULT 'pending'::app_public.purchase_status NOT NULL,
    promo_code character varying(32),
    currency character varying(6) NOT NULL,
    price numeric(12,2) NOT NULL,
    discount_price numeric(12,2),
    token character varying(36),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    score_id integer NOT NULL,
    user_id integer
);


--
-- Name: COLUMN purchases.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.purchases.id IS '@omit create,update';


--
-- Name: COLUMN purchases.currency; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.purchases.currency IS '@omit create, update
Currency requested fot this purchase';


--
-- Name: COLUMN purchases.token; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.purchases.token IS '@omit
Token to verify purchase request';


--
-- Name: purchases_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.purchases ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.purchases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: score_instruments; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.score_instruments (
    instrument_id integer NOT NULL,
    score_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: score_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.score_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    title character varying(255),
    description character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: scores_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.scores ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.scores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sessions; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.sessions (
    sid character varying(255) NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.sessions IS '@omit';


--
-- Name: tag_locales; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tag_locales (
    source_id integer NOT NULL,
    lang character varying(2) NOT NULL,
    name character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tags; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tags (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: COLUMN tags.id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.tags.id IS '@omit create,update';


--
-- Name: COLUMN tags.name; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.tags.name IS '@localize';


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tags ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: job_queues; Type: TABLE; Schema: graphile_worker; Owner: -
--

CREATE TABLE graphile_worker.job_queues (
    queue_name text NOT NULL,
    job_count integer NOT NULL,
    locked_at timestamp with time zone,
    locked_by text
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: graphile_worker; Owner: -
--

CREATE SEQUENCE graphile_worker.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: graphile_worker; Owner: -
--

ALTER SEQUENCE graphile_worker.jobs_id_seq OWNED BY graphile_worker.jobs.id;


--
-- Name: migrations; Type: TABLE; Schema: graphile_worker; Owner: -
--

CREATE TABLE graphile_worker.migrations (
    id integer NOT NULL,
    ts timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: jobs id; Type: DEFAULT; Schema: graphile_worker; Owner: -
--

ALTER TABLE ONLY graphile_worker.jobs ALTER COLUMN id SET DEFAULT nextval('graphile_worker.jobs_id_seq'::regclass);


--
-- Name: email_verifications email_verifications_pkey; Type: CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.email_verifications
    ADD CONSTRAINT email_verifications_pkey PRIMARY KEY (id);


--
-- Name: email_verifications email_verifications_user_id_email_key; Type: CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.email_verifications
    ADD CONSTRAINT email_verifications_user_id_email_key UNIQUE (user_id, email);


--
-- Name: reset_passwords reset_passwords_pkey; Type: CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.reset_passwords
    ADD CONSTRAINT reset_passwords_pkey PRIMARY KEY (id);


--
-- Name: article_galleries article_galleries_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_galleries
    ADD CONSTRAINT article_galleries_pkey PRIMARY KEY (id);


--
-- Name: article_gallery_images article_gallery_images_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_gallery_images
    ADD CONSTRAINT article_gallery_images_pkey PRIMARY KEY (gallery_id, image_id);


--
-- Name: article_genres article_genres_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_genres
    ADD CONSTRAINT article_genres_pkey PRIMARY KEY (article_id, genre_id);


--
-- Name: article_images article_images_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_images
    ADD CONSTRAINT article_images_pkey PRIMARY KEY (article_id, image_id);


--
-- Name: article_locales article_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_locales
    ADD CONSTRAINT article_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: article_tags article_tags_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_tags
    ADD CONSTRAINT article_tags_pkey PRIMARY KEY (article_id, tag_id);


--
-- Name: articles articles_path_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.articles
    ADD CONSTRAINT articles_path_key UNIQUE (path);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: composition_locales composition_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.composition_locales
    ADD CONSTRAINT composition_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: compositions compositions_path_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.compositions
    ADD CONSTRAINT compositions_path_key UNIQUE (path);


--
-- Name: compositions compositions_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.compositions
    ADD CONSTRAINT compositions_pkey PRIMARY KEY (id);


--
-- Name: document_locales document_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.document_locales
    ADD CONSTRAINT document_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: genre_locales genre_locales_name_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.genre_locales
    ADD CONSTRAINT genre_locales_name_key UNIQUE (name);


--
-- Name: genre_locales genre_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.genre_locales
    ADD CONSTRAINT genre_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: genres genres_name_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.genres
    ADD CONSTRAINT genres_name_key UNIQUE (name);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: group_images group_images_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.group_images
    ADD CONSTRAINT group_images_pkey PRIMARY KEY (group_id, image_id);


--
-- Name: group_locales group_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.group_locales
    ADD CONSTRAINT group_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: group_musicians group_musicians_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.group_musicians
    ADD CONSTRAINT group_musicians_pkey PRIMARY KEY (musician_id, group_id);


--
-- Name: group_playlists group_playlists_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.group_playlists
    ADD CONSTRAINT group_playlists_pkey PRIMARY KEY (group_id, playlist_id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: image_locales image_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.image_locales
    ADD CONSTRAINT image_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: instrument_locales instrument_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.instrument_locales
    ADD CONSTRAINT instrument_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: instruments instruments_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.instruments
    ADD CONSTRAINT instruments_pkey PRIMARY KEY (id);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (code);


--
-- Name: media_locales media_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.media_locales
    ADD CONSTRAINT media_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: musician_compositions musician_compositions_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_compositions
    ADD CONSTRAINT musician_compositions_pkey PRIMARY KEY (composition_id, musician_id);


--
-- Name: musician_genres musician_genres_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_genres
    ADD CONSTRAINT musician_genres_pkey PRIMARY KEY (musician_id, genre_id);


--
-- Name: musician_images musician_images_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_images
    ADD CONSTRAINT musician_images_pkey PRIMARY KEY (image_id, musician_id);


--
-- Name: musician_locales musician_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_locales
    ADD CONSTRAINT musician_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: musician_playlists musician_playlists_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_playlists
    ADD CONSTRAINT musician_playlists_pkey PRIMARY KEY (musician_id, playlist_id);


--
-- Name: musician_professions musician_professions_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_professions
    ADD CONSTRAINT musician_professions_pkey PRIMARY KEY (musician_id, profession_id);


--
-- Name: musician_tags musician_tags_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_tags
    ADD CONSTRAINT musician_tags_pkey PRIMARY KEY (musician_id, tag_id);


--
-- Name: musicians musicians_path_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musicians
    ADD CONSTRAINT musicians_path_key UNIQUE (path);


--
-- Name: musicians musicians_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musicians
    ADD CONSTRAINT musicians_pkey PRIMARY KEY (id);


--
-- Name: open_messages open_messages_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.open_messages
    ADD CONSTRAINT open_messages_pkey PRIMARY KEY (id);


--
-- Name: page_sections page_sections_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.page_sections
    ADD CONSTRAINT page_sections_pkey PRIMARY KEY (page, name);


--
-- Name: playlist_locales playlist_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.playlist_locales
    ADD CONSTRAINT playlist_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: playlist_media playlist_media_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.playlist_media
    ADD CONSTRAINT playlist_media_pkey PRIMARY KEY (media_id, playlist_id);


--
-- Name: playlists playlists_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.playlists
    ADD CONSTRAINT playlists_pkey PRIMARY KEY (id);


--
-- Name: profession_locales profession_locales_name_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.profession_locales
    ADD CONSTRAINT profession_locales_name_key UNIQUE (name);


--
-- Name: profession_locales profession_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.profession_locales
    ADD CONSTRAINT profession_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: professions professions_name_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.professions
    ADD CONSTRAINT professions_name_key UNIQUE (name);


--
-- Name: professions professions_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.professions
    ADD CONSTRAINT professions_pkey PRIMARY KEY (id);


--
-- Name: promo_codes promo_codes_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.promo_codes
    ADD CONSTRAINT promo_codes_pkey PRIMARY KEY (code);


--
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (id);


--
-- Name: score_instruments score_instruments_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.score_instruments
    ADD CONSTRAINT score_instruments_pkey PRIMARY KEY (instrument_id, score_id);


--
-- Name: score_locales score_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.score_locales
    ADD CONSTRAINT score_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: scores scores_path_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.scores
    ADD CONSTRAINT scores_path_key UNIQUE (path);


--
-- Name: scores scores_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.scores
    ADD CONSTRAINT scores_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: tag_locales tag_locales_name_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tag_locales
    ADD CONSTRAINT tag_locales_name_key UNIQUE (name);


--
-- Name: tag_locales tag_locales_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tag_locales
    ADD CONSTRAINT tag_locales_pkey PRIMARY KEY (source_id, lang);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_facebook_id_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.users
    ADD CONSTRAINT users_facebook_id_key UNIQUE (facebook_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: job_queues job_queues_pkey; Type: CONSTRAINT; Schema: graphile_worker; Owner: -
--

ALTER TABLE ONLY graphile_worker.job_queues
    ADD CONSTRAINT job_queues_pkey PRIMARY KEY (queue_name);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: graphile_worker; Owner: -
--

ALTER TABLE ONLY graphile_worker.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: graphile_worker; Owner: -
--

ALTER TABLE ONLY graphile_worker.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: jobs_priority_run_at_id_idx; Type: INDEX; Schema: graphile_worker; Owner: -
--

CREATE INDEX jobs_priority_run_at_id_idx ON graphile_worker.jobs USING btree (priority, run_at, id);


--
-- Name: open_messages send_slack_message; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER send_slack_message AFTER INSERT ON app_public.open_messages FOR EACH ROW EXECUTE PROCEDURE app_private.new_open_message();


--
-- Name: jobs _100_timestamps; Type: TRIGGER; Schema: graphile_worker; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON graphile_worker.jobs FOR EACH ROW EXECUTE PROCEDURE graphile_worker.tg__update_timestamp();


--
-- Name: jobs _500_decrease_job_queue_count; Type: TRIGGER; Schema: graphile_worker; Owner: -
--

CREATE TRIGGER _500_decrease_job_queue_count AFTER DELETE ON graphile_worker.jobs FOR EACH ROW EXECUTE PROCEDURE graphile_worker.jobs__decrease_job_queue_count();


--
-- Name: jobs _500_decrease_job_queue_count_update; Type: TRIGGER; Schema: graphile_worker; Owner: -
--

CREATE TRIGGER _500_decrease_job_queue_count_update AFTER UPDATE OF queue_name ON graphile_worker.jobs FOR EACH ROW EXECUTE PROCEDURE graphile_worker.jobs__decrease_job_queue_count();


--
-- Name: jobs _500_increase_job_queue_count; Type: TRIGGER; Schema: graphile_worker; Owner: -
--

CREATE TRIGGER _500_increase_job_queue_count AFTER INSERT ON graphile_worker.jobs FOR EACH ROW EXECUTE PROCEDURE graphile_worker.jobs__increase_job_queue_count();


--
-- Name: jobs _500_increase_job_queue_count_update; Type: TRIGGER; Schema: graphile_worker; Owner: -
--

CREATE TRIGGER _500_increase_job_queue_count_update AFTER UPDATE OF queue_name ON graphile_worker.jobs FOR EACH ROW EXECUTE PROCEDURE graphile_worker.jobs__increase_job_queue_count();


--
-- Name: jobs _900_notify_worker; Type: TRIGGER; Schema: graphile_worker; Owner: -
--

CREATE TRIGGER _900_notify_worker AFTER INSERT ON graphile_worker.jobs FOR EACH STATEMENT EXECUTE PROCEDURE graphile_worker.tg_jobs__notify_new_jobs();


--
-- Name: email_verifications email_verifications_user_id_fkey; Type: FK CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.email_verifications
    ADD CONSTRAINT email_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES app_public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: article_gallery_images article_gallery_images_gallery_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_gallery_images
    ADD CONSTRAINT article_gallery_images_gallery_id_fkey FOREIGN KEY (gallery_id) REFERENCES app_public.article_galleries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: article_gallery_images article_gallery_images_image_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_gallery_images
    ADD CONSTRAINT article_gallery_images_image_id_fkey FOREIGN KEY (image_id) REFERENCES app_public.images(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: article_genres article_genres_article_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_genres
    ADD CONSTRAINT article_genres_article_id_fkey FOREIGN KEY (article_id) REFERENCES app_public.articles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: article_genres article_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_genres
    ADD CONSTRAINT article_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES app_public.genres(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: article_images article_images_article_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_images
    ADD CONSTRAINT article_images_article_id_fkey FOREIGN KEY (article_id) REFERENCES app_public.articles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: article_images article_images_image_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_images
    ADD CONSTRAINT article_images_image_id_fkey FOREIGN KEY (image_id) REFERENCES app_public.images(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: article_locales article_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_locales
    ADD CONSTRAINT article_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: article_locales article_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_locales
    ADD CONSTRAINT article_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.articles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: article_tags article_tags_article_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_tags
    ADD CONSTRAINT article_tags_article_id_fkey FOREIGN KEY (article_id) REFERENCES app_public.articles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: article_tags article_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.article_tags
    ADD CONSTRAINT article_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES app_public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: articles articles_author_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.articles
    ADD CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES app_public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: articles articles_gallery_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.articles
    ADD CONSTRAINT articles_gallery_id_fkey FOREIGN KEY (gallery_id) REFERENCES app_public.article_galleries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: articles articles_poster_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.articles
    ADD CONSTRAINT articles_poster_id_fkey FOREIGN KEY (poster_id) REFERENCES app_public.images(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: articles articles_updater_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.articles
    ADD CONSTRAINT articles_updater_id_fkey FOREIGN KEY (updater_id) REFERENCES app_public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: composition_locales composition_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.composition_locales
    ADD CONSTRAINT composition_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: composition_locales composition_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.composition_locales
    ADD CONSTRAINT composition_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.compositions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: document_locales document_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.document_locales
    ADD CONSTRAINT document_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: document_locales document_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.document_locales
    ADD CONSTRAINT document_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.documents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: genre_locales genre_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.genre_locales
    ADD CONSTRAINT genre_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: genre_locales genre_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.genre_locales
    ADD CONSTRAINT genre_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.genres(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_images group_images_group_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.group_images
    ADD CONSTRAINT group_images_group_id_fkey FOREIGN KEY (group_id) REFERENCES app_public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_images group_images_image_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.group_images
    ADD CONSTRAINT group_images_image_id_fkey FOREIGN KEY (image_id) REFERENCES app_public.images(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_locales group_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.group_locales
    ADD CONSTRAINT group_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: group_locales group_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.group_locales
    ADD CONSTRAINT group_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_musicians group_musicians_group_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.group_musicians
    ADD CONSTRAINT group_musicians_group_id_fkey FOREIGN KEY (group_id) REFERENCES app_public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_musicians group_musicians_musician_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.group_musicians
    ADD CONSTRAINT group_musicians_musician_id_fkey FOREIGN KEY (musician_id) REFERENCES app_public.musicians(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_playlists group_playlists_group_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.group_playlists
    ADD CONSTRAINT group_playlists_group_id_fkey FOREIGN KEY (group_id) REFERENCES app_public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_playlists group_playlists_playlist_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.group_playlists
    ADD CONSTRAINT group_playlists_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES app_public.playlists(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: groups groups_photo_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.groups
    ADD CONSTRAINT groups_photo_id_fkey FOREIGN KEY (photo_id) REFERENCES app_public.images(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: image_locales image_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.image_locales
    ADD CONSTRAINT image_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: image_locales image_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.image_locales
    ADD CONSTRAINT image_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.images(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: instrument_locales instrument_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.instrument_locales
    ADD CONSTRAINT instrument_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: instrument_locales instrument_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.instrument_locales
    ADD CONSTRAINT instrument_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.instruments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: media_locales media_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.media_locales
    ADD CONSTRAINT media_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: media_locales media_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.media_locales
    ADD CONSTRAINT media_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.media(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_compositions musician_compositions_composition_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_compositions
    ADD CONSTRAINT musician_compositions_composition_id_fkey FOREIGN KEY (composition_id) REFERENCES app_public.compositions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_compositions musician_compositions_musician_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_compositions
    ADD CONSTRAINT musician_compositions_musician_id_fkey FOREIGN KEY (musician_id) REFERENCES app_public.musicians(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_genres musician_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_genres
    ADD CONSTRAINT musician_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES app_public.genres(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_genres musician_genres_musician_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_genres
    ADD CONSTRAINT musician_genres_musician_id_fkey FOREIGN KEY (musician_id) REFERENCES app_public.musicians(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_images musician_images_image_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_images
    ADD CONSTRAINT musician_images_image_id_fkey FOREIGN KEY (image_id) REFERENCES app_public.images(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_images musician_images_musician_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_images
    ADD CONSTRAINT musician_images_musician_id_fkey FOREIGN KEY (musician_id) REFERENCES app_public.musicians(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_locales musician_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_locales
    ADD CONSTRAINT musician_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: musician_locales musician_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_locales
    ADD CONSTRAINT musician_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.musicians(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_playlists musician_playlists_musician_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_playlists
    ADD CONSTRAINT musician_playlists_musician_id_fkey FOREIGN KEY (musician_id) REFERENCES app_public.musicians(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_playlists musician_playlists_playlist_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_playlists
    ADD CONSTRAINT musician_playlists_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES app_public.playlists(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_professions musician_professions_musician_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_professions
    ADD CONSTRAINT musician_professions_musician_id_fkey FOREIGN KEY (musician_id) REFERENCES app_public.musicians(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_professions musician_professions_profession_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_professions
    ADD CONSTRAINT musician_professions_profession_id_fkey FOREIGN KEY (profession_id) REFERENCES app_public.professions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_tags musician_tags_musician_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_tags
    ADD CONSTRAINT musician_tags_musician_id_fkey FOREIGN KEY (musician_id) REFERENCES app_public.musicians(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musician_tags musician_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musician_tags
    ADD CONSTRAINT musician_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES app_public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: musicians musicians_photo_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.musicians
    ADD CONSTRAINT musicians_photo_id_fkey FOREIGN KEY (photo_id) REFERENCES app_public.images(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: playlist_locales playlist_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.playlist_locales
    ADD CONSTRAINT playlist_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: playlist_locales playlist_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.playlist_locales
    ADD CONSTRAINT playlist_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.playlists(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: playlist_media playlist_media_media_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.playlist_media
    ADD CONSTRAINT playlist_media_media_id_fkey FOREIGN KEY (media_id) REFERENCES app_public.media(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: playlist_media playlist_media_playlist_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.playlist_media
    ADD CONSTRAINT playlist_media_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES app_public.playlists(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: playlists playlists_owner_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.playlists
    ADD CONSTRAINT playlists_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES app_public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: profession_locales profession_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.profession_locales
    ADD CONSTRAINT profession_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: profession_locales profession_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.profession_locales
    ADD CONSTRAINT profession_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.professions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchases purchases_score_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.purchases
    ADD CONSTRAINT purchases_score_id_fkey FOREIGN KEY (score_id) REFERENCES app_public.scores(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchases purchases_user_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.purchases
    ADD CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES app_public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: score_instruments score_instruments_instrument_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.score_instruments
    ADD CONSTRAINT score_instruments_instrument_id_fkey FOREIGN KEY (instrument_id) REFERENCES app_public.instruments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: score_instruments score_instruments_score_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.score_instruments
    ADD CONSTRAINT score_instruments_score_id_fkey FOREIGN KEY (score_id) REFERENCES app_public.scores(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: score_locales score_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.score_locales
    ADD CONSTRAINT score_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: score_locales score_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.score_locales
    ADD CONSTRAINT score_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.scores(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: scores scores_composition_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.scores
    ADD CONSTRAINT scores_composition_id_fkey FOREIGN KEY (composition_id) REFERENCES app_public.compositions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tag_locales tag_locales_lang_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tag_locales
    ADD CONSTRAINT tag_locales_lang_fkey FOREIGN KEY (lang) REFERENCES app_public.languages(code);


--
-- Name: tag_locales tag_locales_source_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tag_locales
    ADD CONSTRAINT tag_locales_source_id_fkey FOREIGN KEY (source_id) REFERENCES app_public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: postgraphile_watch_ddl; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE PROCEDURE postgraphile_watch.notify_watchers_ddl();


--
-- Name: postgraphile_watch_drop; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE PROCEDURE postgraphile_watch.notify_watchers_drop();


--
-- Name: promo_codes delete_admin; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY delete_admin ON app_public.promo_codes FOR DELETE USING ((app_public.current_user_role() = 'admin'::app_public.user_role));


--
-- Name: promo_codes insert_admin; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY insert_admin ON app_public.promo_codes FOR INSERT WITH CHECK ((app_public.current_user_role() = 'admin'::app_public.user_role));


--
-- Name: open_messages insert_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY insert_all ON app_public.open_messages FOR INSERT WITH CHECK (true);


--
-- Name: open_messages; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.open_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: promo_codes; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.promo_codes ENABLE ROW LEVEL SECURITY;

--
-- Name: open_messages select_admin; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_admin ON app_public.open_messages FOR SELECT USING ((app_public.current_user_role() = 'admin'::app_public.user_role));


--
-- Name: promo_codes select_admin; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_admin ON app_public.promo_codes FOR SELECT USING ((app_public.current_user_role() = 'admin'::app_public.user_role));


--
-- Name: promo_codes update_admin; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY update_admin ON app_public.promo_codes FOR UPDATE USING ((app_public.current_user_role() = 'admin'::app_public.user_role));


--
-- Name: job_queues; Type: ROW SECURITY; Schema: graphile_worker; Owner: -
--

ALTER TABLE graphile_worker.job_queues ENABLE ROW LEVEL SECURITY;

--
-- Name: jobs; Type: ROW SECURITY; Schema: graphile_worker; Owner: -
--

ALTER TABLE graphile_worker.jobs ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA app_hidden; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_hidden TO anm_visitor;


--
-- Name: SCHEMA app_public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_public TO anm_visitor;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO anm;
GRANT USAGE ON SCHEMA public TO anm_visitor;


--
-- Name: FUNCTION create_code(len integer, alpha boolean); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.create_code(len integer, alpha boolean) FROM PUBLIC;


--
-- Name: FUNCTION new_open_message(); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.new_open_message() FROM PUBLIC;


--
-- Name: FUNCTION change_user_role(user_id integer, role app_public.user_role); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.change_user_role(user_id integer, role app_public.user_role) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.change_user_role(user_id integer, role app_public.user_role) TO anm_visitor;


--
-- Name: FUNCTION change_user_status(user_id integer, status app_public.user_status); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.change_user_status(user_id integer, status app_public.user_status) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.change_user_status(user_id integer, status app_public.user_status) TO anm_visitor;


--
-- Name: FUNCTION create_promo_code(percent integer, status app_public.promo_code_status, expires_at timestamp with time zone); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.create_promo_code(percent integer, status app_public.promo_code_status, expires_at timestamp with time zone) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.create_promo_code(percent integer, status app_public.promo_code_status, expires_at timestamp with time zone) TO anm_visitor;


--
-- Name: FUNCTION create_promo_codes(count integer, percent integer, status app_public.promo_code_status, expires_at timestamp with time zone); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.create_promo_codes(count integer, percent integer, status app_public.promo_code_status, expires_at timestamp with time zone) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.create_promo_codes(count integer, percent integer, status app_public.promo_code_status, expires_at timestamp with time zone) TO anm_visitor;


--
-- Name: FUNCTION "current_user"(not_null boolean); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public."current_user"(not_null boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public."current_user"(not_null boolean) TO anm_visitor;


--
-- Name: FUNCTION current_user_id(not_null boolean); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.current_user_id(not_null boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.current_user_id(not_null boolean) TO anm_visitor;


--
-- Name: FUNCTION current_user_role(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.current_user_role() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.current_user_role() TO anm_visitor;


--
-- Name: FUNCTION forgot_password(email public.citext); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.forgot_password(email public.citext) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.forgot_password(email public.citext) TO anm_visitor;


--
-- Name: FUNCTION reset_password(token text, password text); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.reset_password(token text, password text) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.reset_password(token text, password text) TO anm_visitor;


--
-- Name: FUNCTION scores_is_purchased(score app_public.scores); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.scores_is_purchased(score app_public.scores) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.scores_is_purchased(score app_public.scores) TO anm_visitor;


--
-- Name: FUNCTION send_verification_email(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.send_verification_email() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.send_verification_email() TO anm_visitor;


--
-- Name: FUNCTION set_timestamps(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.set_timestamps() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.set_timestamps() TO anm_visitor;


--
-- Name: FUNCTION users_email_verification_status(i_user app_public.users); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.users_email_verification_status(i_user app_public.users) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.users_email_verification_status(i_user app_public.users) TO anm_visitor;


--
-- Name: FUNCTION verify_email(code text); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.verify_email(code text) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.verify_email(code text) TO anm_visitor;


--
-- Name: FUNCTION notify_watchers_ddl(); Type: ACL; Schema: postgraphile_watch; Owner: -
--

REVOKE ALL ON FUNCTION postgraphile_watch.notify_watchers_ddl() FROM PUBLIC;


--
-- Name: FUNCTION notify_watchers_drop(); Type: ACL; Schema: postgraphile_watch; Owner: -
--

REVOKE ALL ON FUNCTION postgraphile_watch.notify_watchers_drop() FROM PUBLIC;


--
-- Name: SEQUENCE article_galleries_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.article_galleries_id_seq TO anm_visitor;


--
-- Name: SEQUENCE articles_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.articles_id_seq TO anm_visitor;


--
-- Name: SEQUENCE compositions_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.compositions_id_seq TO anm_visitor;


--
-- Name: SEQUENCE documents_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.documents_id_seq TO anm_visitor;


--
-- Name: SEQUENCE genres_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.genres_id_seq TO anm_visitor;


--
-- Name: SEQUENCE groups_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.groups_id_seq TO anm_visitor;


--
-- Name: SEQUENCE images_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.images_id_seq TO anm_visitor;


--
-- Name: SEQUENCE instruments_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.instruments_id_seq TO anm_visitor;


--
-- Name: SEQUENCE media_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.media_id_seq TO anm_visitor;


--
-- Name: SEQUENCE musicians_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.musicians_id_seq TO anm_visitor;


--
-- Name: SEQUENCE open_messages_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.open_messages_id_seq TO anm_visitor;


--
-- Name: SEQUENCE playlists_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.playlists_id_seq TO anm_visitor;


--
-- Name: SEQUENCE professions_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.professions_id_seq TO anm_visitor;


--
-- Name: SEQUENCE purchases_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.purchases_id_seq TO anm_visitor;


--
-- Name: SEQUENCE scores_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.scores_id_seq TO anm_visitor;


--
-- Name: SEQUENCE tags_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.tags_id_seq TO anm_visitor;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.users_id_seq TO anm_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA app_hidden REVOKE ALL ON SEQUENCES  FROM anm;
ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA app_hidden GRANT SELECT,USAGE ON SEQUENCES  TO anm_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA app_hidden REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA app_hidden REVOKE ALL ON FUNCTIONS  FROM anm;
ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA app_hidden GRANT ALL ON FUNCTIONS  TO anm_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA app_public REVOKE ALL ON SEQUENCES  FROM anm;
ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA app_public GRANT SELECT,USAGE ON SEQUENCES  TO anm_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA app_public REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA app_public REVOKE ALL ON FUNCTIONS  FROM anm;
ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA app_public GRANT ALL ON FUNCTIONS  TO anm_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA public REVOKE ALL ON SEQUENCES  FROM anm;
ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES  TO anm_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA public REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA public REVOKE ALL ON FUNCTIONS  FROM anm;
ALTER DEFAULT PRIVILEGES FOR ROLE anm IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anm_visitor;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE anm REVOKE ALL ON FUNCTIONS  FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

