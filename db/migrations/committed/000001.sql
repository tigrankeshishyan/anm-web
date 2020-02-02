--! Previous: -
--! Hash: sha1:8157ce8763594482ddd888f57194d70b8184ddb6

drop schema if exists app_public cascade;

alter default privileges revoke all on sequences from public;
alter default privileges revoke all on functions from public;

revoke all on schema public from public;
grant all on schema public to :DATABASE_OWNER;

create schema app_public;
grant usage on schema public, app_public to :DATABASE_VISITOR;

drop schema if exists app_hidden cascade;
create schema app_hidden;
grant usage on schema app_hidden to :DATABASE_VISITOR;
alter default privileges in schema app_hidden grant usage, select on sequences to :DATABASE_VISITOR;

alter default privileges in schema public, app_public, app_hidden grant usage, select on sequences to :DATABASE_VISITOR;
alter default privileges in schema public, app_public, app_hidden grant execute on functions to :DATABASE_VISITOR;

drop schema if exists app_public cascade;
create schema app_public;

set search_path to app_public, app_public, app_hidden, public;

create type app_public.email_verification_status as enum ('pending', 'sent', 'verified', 'excess');
create type app_public.media_type as enum ('video', 'audio');

create table app_public.users (
  id int generated by default as identity,
  first_name varchar(32),
  last_name varchar(32),
  avatar varchar(255),
  email citext unique,
  facebook_id bigint unique,
  status integer not null default 0,
  password varchar(255),
  role varchar(32) not null default 'member',
  created_at timestamptz,
  updated_at timestamptz,
  primary key(id)
);

comment on column app_public.users.id is E'@omit create,update';
comment on column app_public.users.status is E'@omit
0 active, 1 blocked';
comment on column app_public.users."password" is E'@omit update,delete';
comment on column app_public.users."role" is E'@omit create,update';
comment on column app_public.users.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.users.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.images (
  id int generated by default as identity,
  url varchar(255) not null,
  caption varchar(255),
  description varchar(255),
  created_at timestamptz,
  updated_at timestamptz,
  primary key (id)
);

comment on column app_public.images.id is E'@omit create,update';
comment on column app_public.images.caption is E'@localize';
comment on column app_public.images.description is E'@localize';
comment on column app_public.images.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.images.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.article_galleries (
  id int generated by default as identity,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (id)
);

comment on column app_public.article_galleries.id is E'@omit create,update';
comment on column app_public.article_galleries.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.article_galleries.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.articles (
  id int generated by default as identity,
  path varchar(255) not null unique,
  title varchar(255),
  description text,
  content text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  author_id integer references app_public.users (id) on delete 
  set 
    null on update cascade,
    updater_id integer references app_public.users (id) on delete 
  set 
    null on update cascade,
    poster_id integer references app_public.images (id) on delete 
  set 
    null on update cascade,
    gallery_id integer references app_public.article_galleries (id) on delete 
  set 
    null on update cascade,
    primary key (id)
);

comment on column app_public.articles.id is E'@omit create,update';
comment on column app_public.articles.path is E'SEO friendly name to use in url';
comment on column app_public.articles.title is E'@localize';
comment on column app_public.articles.description is E'@localize';
comment on column app_public.articles.content is E'@localize';
comment on column app_public.articles.published_at is E'@omit create
This is automatically changed if ''published'' changed, can be manually provided by ''admin''.';
comment on column app_public.articles.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.articles.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.article_gallery_images (
  created_at timestamptz,
  updated_at timestamptz,
  gallery_id integer references app_public.article_galleries (id) on delete cascade on update cascade,
  image_id integer references app_public.images (id) on delete cascade on update cascade,
  primary key (gallery_id, image_id)
);

comment on column app_public.article_gallery_images.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.article_gallery_images.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.genres (
  id int generated by default as identity,
  name varchar(255) unique,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (id)
);

comment on column app_public.genres.id is E'@omit create,update';
comment on column app_public.genres.name is E'@localize';
comment on column app_public.genres.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.genres.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.article_genres (
  article_id integer references app_public.articles (id) on delete cascade on update cascade,
  genre_id integer references app_public.genres (id) on delete cascade on update cascade,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (article_id, genre_id)
);

comment on column app_public.article_genres.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.article_genres.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.article_images (
  created_at timestamptz,
  updated_at timestamptz,
  article_id integer references app_public.articles (id) on delete cascade on update cascade,
  image_id integer references app_public.images (id) on delete cascade on update cascade,
  primary key (article_id, image_id)
);

comment on column app_public.article_images.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.article_images.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.tags (
  id int generated by default as identity,
  name varchar(255) unique,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (id)
);

comment on column app_public.tags.id is E'@omit create,update';
comment on column app_public.tags.name is E'@localize';
comment on column app_public.tags.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.tags.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.article_tags (
  created_at timestamptz,
  updated_at timestamptz,
  article_id integer references app_public.articles (id) on delete cascade on update cascade,
  tag_id integer references app_public.tags (id) on delete cascade on update cascade,
  primary key (article_id, tag_id)
);

comment on column app_public.article_tags.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.article_tags.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.compositions (
  id int generated by default as identity,
  path varchar(255) unique,
  title varchar(255),
  description varchar(255),
  composing_start timestamptz,
  composing_end timestamptz,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (id)
);

comment on column app_public.compositions.id is E'@omit create,update';
comment on column app_public.compositions.path is E'SEO friendly name to use in url';
comment on column app_public.compositions.title is E'@localize';
comment on column app_public.compositions.description is E'@localize';
comment on column app_public.compositions.published_at is E'@omit create
This is automatically changed if ''published'' changed, can be manually provided by ''admin''.';
comment on column app_public.compositions.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.compositions.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.contact_messages (
  id int generated by default as identity,
  name varchar(255),
  email citext not null,
  message varchar(255) not null,
  attached_file varchar(255),
  created_at timestamptz,
  updated_at timestamptz,
  primary key (id)
);

comment on column app_public.contact_messages.id is E'@omit create,update';
comment on column app_public.contact_messages.attached_file is E'optional file attached by user';
comment on column app_public.contact_messages.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.contact_messages.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.documents (
  id int generated by default as identity,
  name varchar(32),
  content text,
  created_at timestamptz,
  updated_at timestamptz,
  primary key(id)
);

comment on column app_public.documents.id is E'@omit create,update';
comment on column app_public.documents.content is E'@localize';
comment on column app_public.documents.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.documents.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.email_verifications (
  id int generated by default as identity,
  user_id integer references app_public.users (id) on delete 
  set 
    null on update cascade,
    email citext not null,
    code text,
    status app_public.email_verification_status default 'pending',
    attempts integer not null default 0,
    sib_message_id text,
    created_at timestamptz,
    updated_at timestamptz,
    primary key (id)
);

comment on table app_public.email_verifications is E'@omit';
comment on column app_public.email_verifications.id is E'@omit create,update';
comment on column app_public.email_verifications.code is E'verification code';
comment on column app_public.email_verifications.sib_message_id is E'Send In Blue messageId';
comment on column app_public.email_verifications.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.email_verifications.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.groups (
  id int generated by default as identity,
  founded timestamptz,
  name varchar(255),
  biography text,
  created_at timestamptz,
  updated_at timestamptz,
  photo_id integer references app_public.images (id) on delete 
  set 
    null on update cascade,
    primary key(id)
);

comment on column app_public.groups.id is E'@omit create,update';
comment on column app_public.groups.name is E'@localize';
comment on column app_public.groups.biography is E'@localize';
comment on column app_public.groups.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.groups.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.group_images (
  group_id integer references app_public.groups (id) on delete cascade on update cascade,
  image_id integer references app_public.images (id) on delete cascade on update cascade,
  primary key (group_id, image_id),
  created_at timestamptz,
  updated_at timestamptz
);

comment on column app_public.group_images.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.group_images.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.musicians (
  id int generated by default as identity,
  path varchar(255) not null unique,
  birthday date,
  deathday date,
  type varchar(32) not null,
  description text,
  first_name varchar(255),
  last_name varchar(255),
  biography text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  photo_id integer references app_public.images (id) on delete 
  set 
    null on update cascade,
  primary key(id)
);

comment on column app_public.musicians.id is E'@omit create,update';
comment on column app_public.musicians.path is E'SEO friendly name to use in url';
comment on column app_public.musicians.description is E'@localize';
comment on column app_public.musicians.first_name is E'@localize';
comment on column app_public.musicians.last_name is E'@localize';
comment on column app_public.musicians.biography is E'@localize';
comment on column app_public.musicians.published_at is E'@omit create
This is automatically changed if ''published'' changed, can be manually provided by ''admin''.';
comment on column app_public.musicians.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.musicians.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.group_musicians (
  created_at timestamptz,
  updated_at timestamptz,
  musician_id integer references app_public.musicians (id) on delete cascade on update cascade,
  group_id integer references app_public.groups (id) on delete cascade on update cascade,
  primary key (musician_id, group_id)
);

comment on column app_public.group_musicians.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.group_musicians.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.playlists (
  id int generated by default as identity,
  is_public boolean default false,
  name varchar(255),
  created_at timestamptz,
  updated_at timestamptz,
  owner_id integer references app_public.users (id) on delete 
  set 
    null on update cascade,
    primary key (id)
);

comment on column app_public.playlists.id is E'@omit create,update';
comment on column app_public.playlists.name is E'@localize';
comment on column app_public.playlists.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.playlists.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.group_playlists (
  created_at timestamptz,
  updated_at timestamptz,
  group_id integer references app_public.groups (id) on delete cascade on update cascade,
  playlist_id integer references app_public.playlists (id) on delete cascade on update cascade,
  primary key (group_id, playlist_id)
);

comment on column app_public.group_playlists.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.group_playlists.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.instruments (
  id int generated by default as identity,
  name varchar(255),
  description text,
  created_at timestamptz,
  updated_at timestamptz,
  primary key(id)
);

comment on column app_public.instruments.id is E'@omit create,update';
comment on column app_public.instruments.name is E'@localize';
comment on column app_public.instruments.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.instruments.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.languages (
  code varchar(2) not null unique,
  primary key (code)
);

comment on table app_public.languages is E'@omit update,delete';

create table app_public.media (
  id int generated by default as identity,
  url varchar(255) not null,
  media_type app_public.media_type,
  title varchar(255),
  created_at timestamptz,
  updated_at timestamptz,
  primary key (id)
);

comment on column app_public.media.id is E'@omit create,update';
comment on column app_public.media.title is E'@localize';
comment on column app_public.media.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.media.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.musician_compositions (
  created_at timestamptz,
  updated_at timestamptz,
  composition_id integer references app_public.compositions (id) on delete cascade on update cascade,
  musician_id integer references app_public.musicians (id) on delete cascade on update cascade,
  primary key (composition_id, musician_id)
);

comment on column app_public.musician_compositions.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.musician_compositions.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.musician_genres (
  created_at timestamptz,
  updated_at timestamptz,
  musician_id integer references app_public.musicians (id) on delete cascade on update cascade,
  genre_id integer references app_public.genres (id) on delete cascade on update cascade,
  primary key (musician_id, genre_id)
);

comment on column app_public.musician_genres.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.musician_genres.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.musician_images (
  created_at timestamptz,
  updated_at timestamptz,
  image_id integer references app_public.images (id) on delete cascade on update cascade,
  musician_id integer references app_public.musicians (id) on delete cascade on update cascade,
  primary key (image_id, musician_id)
);

comment on column app_public.musician_images.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.musician_images.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.musician_playlists (
  created_at timestamptz,
  updated_at timestamptz,
  musician_id integer references app_public.musicians (id) on delete cascade on update cascade,
  playlist_id integer references app_public.playlists (id) on delete cascade on update cascade,
  primary key (musician_id, playlist_id)
);

comment on column app_public.musician_playlists.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.musician_playlists.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.professions (
  id int generated by default as identity,
  name varchar(255) unique,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (id)
);

comment on column app_public.professions.id is E'@omit create,update';
comment on column app_public.professions.name is E'@localize';
comment on column app_public.professions.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.professions.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.musician_professions (
  created_at timestamptz,
  updated_at timestamptz,
  musician_id integer references app_public.musicians (id) on delete cascade on update cascade,
  profession_id integer references app_public.professions (id) on delete cascade on update cascade,
  primary key (musician_id, profession_id)
);

comment on column app_public.musician_professions.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.musician_professions.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.musician_tags (
  created_at timestamptz,
  updated_at timestamptz,
  musician_id integer references app_public.musicians (id) on delete cascade on update cascade,
  tag_id integer references app_public.tags (id) on delete cascade on update cascade,
  primary key (musician_id, tag_id)
);

comment on column app_public.musician_tags.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.musician_tags.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.page_sections (
  page varchar(255) not null,
  name varchar(255) not null,
  attrs jsonb not null default '{}',
  created_at timestamptz,
  updated_at timestamptz,
  primary key (page, name)
);

comment on column app_public.page_sections.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.page_sections.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.playlist_media (
  index integer,
  created_at timestamptz,
  updated_at timestamptz,
  media_id integer references app_public.media (id) on delete cascade on update cascade,
  playlist_id integer references app_public.playlists (id) on delete cascade on update cascade,
  primary key (media_id, playlist_id)
);

comment on column app_public.playlist_media.index is E'Order in playlist';
comment on column app_public.playlist_media.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.playlist_media.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.promo_codes (
  code varchar(255) unique,
  status varchar(32) default 'active',
  percent integer not null default 0,
  expires_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (code)
);

comment on column app_public.promo_codes.code is E'@omit create,update
this also will be used as id';
comment on column app_public.promo_codes.status is E'can be active, used, canceled';
comment on column app_public.promo_codes.percent is E'discount percent, default is 0';
comment on column app_public.promo_codes.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.promo_codes.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.scores (
  id int generated by default as identity, 
  path varchar(255) not null unique, 
  title varchar(255),
  description varchar(255),
  url varchar(255),
  prices jsonb,
  stamp_right varchar(12), 
  stamp_center varchar(12), 
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  composition_id integer references app_public.compositions (id) on delete set null on update cascade,
  primary key (id)
);

comment on column app_public.scores.id is E'@omit create,update';
comment on column app_public.scores.path is E'SEO friendly name to use in url';
comment on column app_public.scores.title is E'@localize';
comment on column app_public.scores.description is E'@localize';
comment on column app_public.scores.prices is E'amount - currency pairs';
comment on column app_public.scores.stamp_right is E'Right side stamp page selection https://pdfcpu.io/getting_started/page_selection, ex. 1';
comment on column app_public.scores.stamp_center is E'Center side stamp page selection https://pdfcpu.io/getting_started/page_selection, ex. 2-';
comment on column app_public.scores.published_at is E'@omit create
This is automatically changed if ''published'' changed, can be manually provided by ''admin''';
comment on column app_public.scores.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.scores.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.purchases (
  id int generated by default as identity,
  status integer not null,
  promo_code varchar(32),
  currency varchar(6) not null,
  price decimal(12, 2) not null,
  discount_price decimal(12, 2),
  token varchar(36),
  created_at timestamptz,
  updated_at timestamptz,
  score_id integer not null references app_public.scores (id) on delete RESTRICT on update cascade,
  user_id integer references app_public.users (id) on delete cascade on update cascade,
  primary key (id)
);

comment on column app_public.purchases.id is E'@omit create,update';
comment on column app_public.purchases.status is E'PENDING = 1, PAID = 2';
comment on column app_public.purchases.currency is E'@omit create, update
Currency requested fot this purchase';
comment on column app_public.purchases.token is E'@omit
Token to verify purchase request';
comment on column app_public.purchases.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.purchases.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.reset_passwords (
  id uuid,
  email text not null,
  attempts integer not null default 0,
  is_expired boolean not null default false,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (id)
);

comment on table app_public.reset_passwords is E'@omit';
comment on column app_public.reset_passwords.id is E'@omit create,update';
comment on column app_public.reset_passwords.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.reset_passwords.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.score_instruments (
  instrument_id integer references app_public.instruments (id) on delete cascade on update cascade,
  score_id integer references app_public.scores (id) on delete cascade on update cascade,
  primary key (instrument_id, score_id),
  created_at timestamptz,
  updated_at timestamptz
);

comment on column app_public.score_instruments.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.score_instruments.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.sessions (
  sid varchar(255),
  sess jsonb not null,
  expire timestamptz not null,
  primary key (sid)
);

comment on table app_public.sessions is E'@omit';

create table app_public.article_locales (
  source_id integer not null references app_public.articles (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  title varchar(255),
  description text,
  content text,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.article_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.article_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.composition_locales (
  source_id integer not null references app_public.compositions (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  title varchar(255),
  description varchar(255),
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.composition_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.composition_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.document_locales (
  source_id integer not null references app_public.documents (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  content text,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.document_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.document_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.genre_locales (
  source_id integer not null references app_public.genres (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  name varchar(255) unique,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.genre_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.genre_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.group_locales (
  source_id integer not null references app_public.groups (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  name varchar(255),
  biography text,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.group_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.group_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.image_locales (
  source_id integer not null references app_public.images (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  caption varchar(255),
  description varchar(255),
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.image_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.image_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.instrument_locales (
  source_id integer not null references app_public.instruments (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  name varchar(255),
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.instrument_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.instrument_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.media_locales (
  source_id integer not null references app_public.media (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  title varchar(255),
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.media_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.media_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.musician_locales (
  source_id integer not null references app_public.musicians (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  description text,
  first_name varchar(255),
  last_name varchar(255),
  biography text,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.musician_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.musician_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.playlist_locales (
  source_id integer not null references app_public.playlists (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  name varchar(255),
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.playlist_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.playlist_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.profession_locales (
  source_id integer not null references app_public.professions (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  name varchar(255) unique,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.profession_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.profession_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.score_locales (
  source_id integer not null references app_public.scores (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  title varchar(255),
  description varchar(255),
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.score_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.score_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create table app_public.tag_locales (
  source_id integer not null references app_public.tags (id) on delete cascade on update cascade,
  lang varchar(2) not null references app_public.languages (code),
  name varchar(255) unique,
  created_at timestamptz,
  updated_at timestamptz,
  primary key (source_id, lang)
);

comment on column app_public.tag_locales.created_at is E'This field is controlled under the hood, don''t use it.';
comment on column app_public.tag_locales.updated_at is E'This field is controlled under the hood, don''t use it.';

create function app_public.set_timestamps()
    returns trigger
    language plpgsql
as
$$
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