create or replace procedure delete_poubelle()
LANGUAGE plpgsql
AS $$
DECLARE
	idPoubelle 	signalement.id_poubelle%type;
	nb_signalement	float;
BEGIN
    -- Boucle sur l'ensemble des poubelles qui ont des signalements pour suppression
	for idPoubelle IN (select distinct s.id_poubelle
					   from signalement s
					   where s.id_type_signalement=(select t.id_type_signalement
												   from type_signalement t
												   where t.type='Suppression'))
   LOOP
        /****************************************************
        * Chaque niveau augmente le signalement de 10% donc 
        * la requête calcule le nombre de signalement total
        * de la poubelle
        *****************************************************/
		select sum(1+0.1*(u.niveau-1)) into nb_signalement
		from signalement s
		join utilisateur u on s.mail=u.mail
		where s.id_poubelle=idPoubelle;

        -- Si la poubelle a 15 signalements au minimum elle est considéré à être supprimé
		if(nb_signalement>=10) then

            -- On ajoute de l'expérience à chaque utilisateur l'ayant signaler
			update utilisateur
			set experience=experience+20
			where mail IN (select s.mail
					        from signalement s
                            where s.id_poubelle=idPoubelle and
							 s.id_type_signalement=(select t.id_type_signalement
												   from type_signalement t
												   where t.type='Suppression')
                            );

            -- On supprime la poubelle
			delete from poubelle p
			where p.id_poubelle=idPoubelle;
		end if;
   END LOOP;
END;
$$;