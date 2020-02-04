begin;
-- add timestamp triggers to all tables with created_at and updated_at
do
$ts_triggers$
    declare
        ts_table record;
        trig_name text;
    begin
        for ts_table in select t.table_name, t.table_schema
            from information_schema.tables t
            where t.table_schema = 'app_public'
              and 2=(select count(1) from information_schema.columns c
                    where c.table_name = t.table_name
                      and c.column_name in ('created_at', 'updated_at'))
            loop
                trig_name = '_100_ts_' || ts_table.table_schema || '_' || ts_table.table_name;
                raise notice E'\n\n';
                raise notice 'drop trigger if exists ''%'' on ''%''', trig_name, ts_table;
                execute 'drop trigger if exists "' || trig_name || '" on ' || quote_ident(ts_table.table_schema) ||
                        '.' || ts_table.table_name;
                raise notice 'creating trigger ''%'' for ''%'' table', trig_name, ts_table;
                execute 'create trigger _100_ts_' || ts_table.table_schema || '_' || ts_table.table_name ||
                        ' before insert or update on ' || ts_table.table_name ||
                        ' for each row execute procedure set_timestamps();';
                execute 'comment on column ' || quote_ident(ts_table.table_schema) || '.' ||
                        quote_ident(ts_table.table_name) || '.created_at is ' || quote_literal('@omit create,update');
                execute 'comment on column ' || quote_ident(ts_table.table_schema) || '.' ||
                        quote_ident(ts_table.table_name) || '.updated_at is ' || quote_literal('@omit create,update');
            end loop;
    end;
$ts_triggers$;
commit;