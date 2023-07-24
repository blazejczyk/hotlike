CREATE EXTENSION postgis;

--

CREATE SCHEMA app AUTHORIZATION doadmin;
CREATE SCHEMA cache AUTHORIZATION doadmin;

--

CREATE TYPE app.activity AS ENUM
    ('cafe', 'cinema', 'museum', 'art', 'bbq', 'beach', 'bar', 'billard', 'bowling', 'canoeing', 'circus', 'climbing', 'concert', 'confectionery', 'cooking', 'cycling', 'dancing', 'fishing', 'football', 'games', 'gym', 'hiking', 'karaoke', 'lunapark', 'mall', 'park', 'party', 'pingpong', 'pub', 'restaurant', 'shopping', 'skating', 'snorkeling', 'surfing', 'swimming', 'television', 'tennis', 'theater', 'zoo', 'running');

ALTER TYPE app.activity OWNER TO doadmin;

--

CREATE TYPE app.body AS ENUM
    ('slim', 'average', 'athletic', 'curvy');

ALTER TYPE app.body OWNER TO doadmin;

--

CREATE TYPE app.gender AS ENUM
    ('male', 'female');

ALTER TYPE app.gender OWNER TO doadmin;

--

CREATE TYPE app.goal AS ENUM
    ('serious_relationship', 'casual_relationship', 'open_relationship', 'friendship', 'acquaintanceship');

ALTER TYPE app.goal OWNER TO doadmin;

--

CREATE TYPE app.personality AS ENUM
    ('introvert', 'ambivert', 'extrovert');

ALTER TYPE app.personality OWNER TO doadmin;

--

CREATE TABLE IF NOT EXISTS app.users
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    cipher text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    gender app.gender NOT NULL,
    date_of_birth date NOT NULL,
    height smallint NOT NULL,
    body app.body NOT NULL,
    smoking boolean NOT NULL,
    activities app.activity[] NOT NULL,
    personality app.personality NOT NULL,
    goals app.goal[] NOT NULL,
    has_kids boolean NOT NULL,
    preferred_genders app.gender[] NOT NULL,
    prefers_taller boolean NOT NULL,
    prefers_shorter boolean NOT NULL,
    rejects_smoking boolean NOT NULL,
    rejects_kids boolean NOT NULL,
    latitude numeric NOT NULL,
    longitude numeric NOT NULL,
    disabled boolean NOT NULL DEFAULT false,
    notifications_token text COLLATE pg_catalog."default",
    activation jsonb,
    authed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS app.users OWNER to doadmin;

--

CREATE TABLE IF NOT EXISTS app.places
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    source_id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    activity app.activity NOT NULL,
    latitude numeric NOT NULL,
    longitude numeric NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT places_pkey PRIMARY KEY (id),
    CONSTRAINT places_source_id_unique UNIQUE (source_id, deleted_at)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS app.places OWNER to doadmin;

--

CREATE TABLE IF NOT EXISTS app.photos
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    width smallint NOT NULL,
    height smallint NOT NULL,
    image bytea NOT NULL,
    thumbnail bytea NOT NULL,
    is_default boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT photos_pkey PRIMARY KEY (id),
    CONSTRAINT photos_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES app.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS app.photos OWNER to doadmin;

CREATE UNIQUE INDEX IF NOT EXISTS default_photo_index
    ON app.photos USING btree
    (user_id ASC NULLS LAST, is_default ASC NULLS LAST)
    TABLESPACE pg_default
    WHERE is_default;

--

CREATE TABLE IF NOT EXISTS app.meetings
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    inviter_user_id uuid NOT NULL,
    invitee_user_id uuid NOT NULL,
    place_id uuid NOT NULL,
    expiration_time timestamp with time zone NOT NULL,
    accepted boolean,
    finished boolean NOT NULL DEFAULT false,
    inviter_polyline jsonb,
    invitee_polyline jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT meetings_pkey PRIMARY KEY (id),
    CONSTRAINT meetings_invitee_user_id_fkey FOREIGN KEY (invitee_user_id)
        REFERENCES app.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT meetings_inviter_user_id_fkey FOREIGN KEY (inviter_user_id)
        REFERENCES app.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT meetings_place_id_fkey FOREIGN KEY (place_id)
        REFERENCES app.places (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS app.meetings OWNER to doadmin;

--

CREATE TABLE IF NOT EXISTS app.messages
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    meeting_id uuid NOT NULL,
    user_id uuid NOT NULL,
    text text COLLATE pg_catalog."default" NOT NULL,
    read boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_meeting_id_fkey FOREIGN KEY (meeting_id)
        REFERENCES app.meetings (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES app.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS app.messages OWNER to doadmin;

--

CREATE TABLE cache.places_imports
(
    id bigserial NOT NULL,
    latitude numeric NOT NULL,
    longitude numeric NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS cache.places_imports OWNER to doadmin;

--

CREATE TABLE IF NOT EXISTS cache.tomtom_poi_categories
(
    id bigint NOT NULL,
    parent_id bigint,
    activity app.activity NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tomtom_poi_categories_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS cache.tomtom_poi_categories OWNER to doadmin;

--