export const searchHeroQuery = function (name) {
  return `
  with tot_rank as (
    select
       heroes.d_kst,
       count(1) as tot_rank
    from generate_series(0,5) as t(i),
      (select combat_power,d_kst from heroes h where character_name ='${name}'order by d_kst desc limit 5) as h,
      heroes as heroes
    where 
      heroes.combat_power > h.combat_power
    and	h.d_kst = to_char(now()::date - i,'YYYY-MM-DD')
    and h.d_kst = heroes.d_kst
    group by heroes.d_kst
  ),server_rank as (
    select
       heroes.d_kst,
       h.combat_power,
       count(1)as server_rank
    from generate_series(0,5) as t(i),
      (select combat_power,d_kst,realm_id from heroes h where character_name ='${name}'order by d_kst desc limit 5) as h,
      heroes as heroes
    where 
      heroes.combat_power >= h.combat_power
    and	h.d_kst = to_char(now()::date - i,'YYYY-MM-DD')
    and h.d_kst = heroes.d_kst
    and h.realm_id =heroes.realm_id 
    group by heroes.d_kst,h.combat_power
  ),class_rank as (
    select
       heroes.d_kst,
       count(1)as class_rank
    from generate_series(0,5) as t(i),
      (select combat_power,d_kst,class_id from heroes h where character_name ='${name}'order by d_kst desc limit 5) as h,
      heroes as heroes
    where 
      heroes.combat_power > h.combat_power
    and	h.d_kst = to_char(now()::date - i,'YYYY-MM-DD')
    and h.d_kst = heroes.d_kst
    and h.class_id =heroes.class_id 
    group by heroes.d_kst
  )
  select
    t.d_kst,
    t.tot_rank,
    s.server_rank,
    s.combat_power,
    c.class_rank
    from
      tot_rank t
    left join
      server_rank s 
    ON 
      t.d_kst = s.d_kst
    left join
      class_rank c 
    on t.d_kst = c.d_kst
  `;
};

export const serverInfoQuery = function (serverName) {
  return `
  select 
    pw*5 as combat_power,
    count(1),
    realm_name
    from (
      select 
        ((combat_power /500000)*10)as pw,
        *
      from heroes h
      where 
        d_kst =(select max(d_kst)
                from 
                  heroes h 
                where 
                  realm_name = '${serverName}')
      and combat_power>1500000
      and realm_name = '${serverName}'
    )as t
  group by pw,realm_name
`;
};

export const guildInfoQuery = function (name) {
  return `
  with target_guild as (
    select 
      d_kst,
      guild_name,
      sum(combat_power)/count(1) as avg_power,
      count(1) as cnt,
      array_agg(ts) AS character_names
    from
      (select 
        *,
        row_to_json(row(character_name, combat_power,class_name))as ts
      from
        heroes h
      where 
        d_kst =(select distinct d_kst from heroes h2 order by d_kst desc limit 1)
      and	guild_name ='${name}'
      order by d_kst,combat_power desc
      )as t
    group by d_kst,guild_name),
  guild_rank as (
    select
      count(1) as guild_rank
    from (
      select 
        h.guild_name,
        h.realm_name,
        (sum(combat_power)/count(1)) as avg_power,
        count(1)
      from
        heroes h,target_guild t
      where
        h.d_kst =t.d_kst
      group by h.guild_name,realm_name
    )as f,target_guild t
    where f.avg_power >=t.avg_power)
  select * from target_guild,guild_rank
`;
};

export const saveHeroesQuery = function (userInfo) {
  return `
  INSERT INTO
  heroes
  (
    n8_id,
    d_kst,
    n4_search_realm,
    n4_search_class,
    ranking,
    is_new,
    diff_ranking,
    combat_power,
    realm_id,
    realm_name,
    class_id,
    class_name,
    character_id,
    character_name,
    character_level,
    guild_id,
    guild_name
  )
  VALUES
  (
    '${userInfo.n8Id}',
    '${userInfo.dKst}',
    '${userInfo.n4SearchRealm}',
    '${userInfo.n4SearchClass}',
    '${userInfo.ranking}',
    '${userInfo.isNew}',
    '${userInfo.diffRanking}',
    '${userInfo.combatPower}',
    '${userInfo.realmId}',
    '${userInfo.realmName}',
    '${userInfo.classId}',
    '${userInfo.className}',
    '${userInfo.characterId}',
    '${userInfo.characterName}',
    '${userInfo.characterLevel}',
    '${userInfo.guildId}',
    '${userInfo.guildName}'
    ) RETURNING *
  `;
};
