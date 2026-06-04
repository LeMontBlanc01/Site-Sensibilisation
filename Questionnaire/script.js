console.log("JS chargé !");

// Déterminer la page actuelle et charger la configuration correspondante
let joueurNom = "Anonyme";
try {
  const nom = prompt("Entrez votre prénom :");
  if (nom) joueurNom = nom;
} catch (e) {
  console.warn("prompt() not available:", e);
}

const pageName = window.location.pathname.split('/').pop().toLowerCase();

const pageConfigs = {
  'facile.html': {
    niveau: 'Facile',
    lastQuizPage: 'facile.html',
    flagStorageKey: 'quizFlags_facile',
    quizAnswersKey: 'quizAnswers_facile',
    questions: {
      q1: { correct: ['g7!pl9@vq2#rt'] },
      q2: { correct: ['oui'] },
      q3: { correct: ['separez', 'utilisez1'] },
      q4: { correct: ['vpn'] },
      q5: { correct: ['pjmail', 'sujetmail', 'adressemail', 'lienmail'] },
      q6: { correct: ['failles'] },
      q7: { correct: ['signaler'] },
      q8: { correct: ['gestionnaire'] },
      q9: { correct: ['infection'] },
      q10: { correct: ['adresse'] },
      q11: { correct: ['2fa'] },
      q12: { correct: ['regulier'] },
      q13: { correct: ['source'] },
      q14: { correct: ['malware'] },
      q18: { correct: ['change'] },   
    },
    matchingQuestions: {
      15: { correctMap: { A: '3', B: '1', C: '2' } },
      16: { correctMap: { A: '2', B: '1', C: '3' } },
      17: { correctMap: { A: '2', B: '1', C: '3' } },
    },
    explications: {
      bonnes: {
        1: "Bonne réponse ! Un bon mot de passe doit contenir au moins 12 caractères, avec une combinaison de lettres majuscules et minuscules, de chiffres et de caractères spéciaux.",
        2: "Bonne réponse ! La clé USB peut être infectée par un virus ou un malware, et en la connectant à votre ordinateur, vous risquez de contaminer votre système. Il est important de ne pas utiliser de périphériques de stockage inconnus ou non sécurisés.",
        3: "Bonne réponse ! Les bonnes pratiques pour protéger ses données personnelles en ligne incluent : séparer les comptes professionnels et personnels et limiter les informations personnelles partagées sur les réseaux sociaux.",
        4: "Bonne réponse ! Un VPN (Virtual Private Network soit Réseau privé virtuel) est un outil qui permet de sécuriser votre connexion internet en chiffrant vos données et en masquant votre adresse IP. Cela protège votre vie privée en ligne et vous permet d'accéder à des contenus restreints géographiquement.",
        5: "Bonne réponse ! Pour vérifier l'authenticité d'un email, il est important de vérifier l'adresse de l'expéditeur, de ne pas cliquer sur les liens ou télécharger les pièces jointes. Il faut aussi faire attention aux fautes d'orthographe ou de grammaire, qui sont souvent présentes dans les emails de phishing. En cas de doute, il est recommandé de contacter directement l'entreprise ou la personne concernée pour vérifier l'authenticité de l'email.",
        6: "Bonne réponse ! Il est important de maintenir son système d'exploitation et ses logiciels à jour pour bénéficier des dernières protections contre les failles de sécurité. Les mises à jour corrigent souvent des vulnérabilités qui pourraient être exploitées par des cybercriminels.",
        7: "Bonne réponse ! Il ne faut pas hésiter à signaler les contenus inappropriés ou les comportements suspects. Ne partagez jamais vos mots de passe ou vos informations personnelles avec des inconnus, même s'ils prétendent être de confiance.",
        8: "Bonne réponse ! Utiliser un gestionnaire de mots de passe est une bonne pratique pour sécuriser ses mots de passe. Un gestionnaire de mots de passe stocke vos mots de passe de manière sécurisée et vous permet de générer des mots de passe forts et uniques pour chaque compte. Exemple: KeePass, LastPass, Dashlane.",
        9: "Bonne réponse ! Il faut faire attention aux appareils qui vous sont inconnus, comme les clés USB trouvées ou prêtées par des personnes que vous ne connaissez pas. Ces appareils peuvent être infectés par des virus ou des logiciels malveillants qui peuvent compromettre la sécurité de votre ordinateur.",
        10: "Bonne réponse ! Il faut toujours vérifier l'adresse URL d'un site avant de saisir des informations personnelles ou de se connecter. Assurez-vous que l'URL commence par 'https://' et que le nom de domaine est correct pour éviter les sites de phishing.",
        11: "Bonne réponse ! L'authentification à deux facteurs (2FA) est une méthode de sécurité qui nécessite deux formes d'identification pour accéder à un compte. En plus de votre mot de passe, vous devez fournir un code généré par une application d'authentification ou reçu par SMS, ce qui rend plus difficile pour les attaquants d'accéder à votre compte.",
        12: "Bonne réponse ! Sauvegarder régulièrement ses données est une bonne pratique pour éviter de les perdre en cas d'incident (panne, attaque, etc.). Utilisez des solutions de sauvegarde en ligne ou des disques durs externes pour protéger vos données importantes.",
        13: "Bonne réponse ! Vérifiez toujours la source d'un logiciel ou d'une application avant de le télécharger. Téléchargez uniquement à partir de sites officiels ou de sources fiables pour éviter les logiciels malveillants.",
        14: "Bonne réponse ! Un malware (contraction de 'malicious software') est un logiciel malveillant conçu pour infiltrer, endommager ou perturber un système informatique. Les malwares peuvent prendre différentes formes, comme les virus, les ransomwares, etc. Ils peuvent voler des données, espionner les utilisateurs ou rendre un système inutilisable.",
        15: "Bonne réponse ! Si l'adresse de messagerie a été usurpée, il faut immédiatement changer le mot de passe pour éviter que l'attaquant ne conserve l'accès au compte et ne continue à envoyer des messages frauduleux en votre nom. Si, par erreur, vous communiquez votre numéro de carte bancaire vous devez faire opposition auprès de votre banque et déposer plainte. Si vous identifiez une adresse de site d'hameçonnage (site qui peut voler des identifiants, infecter le système ou accéder au réseau) vous devez le signaler à Phishing Initiative (Plateforme de signalement et de prévention contre l'hameçonnage).",
        16: "Bonne réponse ! Si vous travaillez régulièrement à l'extérieur, évitez de vous connecter à un réseau Wi-Fi public, car ces réseaux sont souvent non sécurisés et peuvent permettre à des personnes malveillantes d'intercepter vos données. Si vous perdez ou vous vous faites voler votre téléphone, vous devez bloquer votre ligne en appelant votre opérateur et bloquer votre téléphone en communiquant votre code IMEI (identifiant unique de la puce réseau de votre appareil), puis déposer plainte. Si vous téléchargez un jeu sur votre téléphone, n'autorisez pas l'accès à vos photos, vos contacts et vos messages, car un jeu n'a aucune raison légitime d'accéder à ces données personnelles.",
        17: "Bonne réponse ! Si vous êtes à la maison et vous devez consulter vos messages professionnels, assurez-vous de le faire uniquement à partir de votre ordinateur professionnel. Si vous vous apprêtez à stocker des documents professionnels sur un service en ligne personnel, demandez l'autorisation à votre employeur et prenez des mesures de sécurité supplémentaires. Si ça vous arrive de réaliser des téléchargements illégaux depuis votre ordinateur professionnel, votre entreprise pourrait contrôler votre utilisation de la connexion Internet professionnelle et se retourner contre vous.",
        18: "Bonne réponse ! En cas de suspicion de phishing, il est important de changer immédiatement vos mots de passe pour les comptes concernés. De plus, signalez l'incident à votre service informatique ou à l'équipe de sécurité de votre organisation pour qu'ils puissent prendre les mesures nécessaires pour protéger les autres utilisateurs.",
      },
      mauvaises: {
        1: "Mauvaise réponse. Un bon mot de passe doit être long et complexe, contenant une combinaison de lettres majuscules et minuscules, de chiffres et de caractères spéciaux.",
        2: "Mauvaise réponse. Il est important de ne pas utiliser de périphériques de stockage inconnus ou non sécurisés, car ils peuvent être infectés par des virus ou des malwares qui peuvent contaminer votre système.",
        3: "Mauvaise réponse. Il ne faut pas hésiter à dissocier le professionnel du personnel.",
        4: "Mauvaise réponse. Un VPN est un réseau privé virtuel qui sécurise votre connexion internet en chiffrant vos données et en masquant votre adresse IP.",
        5: "Mauvaise réponse. Il faut vérifier plusieurs éléments dans un e-mail pour s'assurer de son authenticité. Comme l'adresse de l'expéditeur, les liens présents dans le mail, les pièces jointes, et faire attention aux fautes d'orthographe ou de grammaire.",
        6: "Mauvaise réponse. Les mises à jour sont importantes pour la sécurité de votre système.",
        7: "Mauvaise réponse. Ne partagez jamais vos informations personnelles avec des inconnus, même s'ils prétendent être de confiance.",
        8: "Mauvaise réponse. Un gestionnaire de mots de passe est un outil qui peut vous aider à gérer vos mots de passe de manière sécurisée.",
        9: "Mauvaise réponse. Il faut faire attention aux appareils qui vous sont inconnus, ces appareils peuvent être infectés par des virus ou des logiciels malveillants.",
        10: "Mauvaise réponse. Il faut toujours vérifier l'adresse URL d'un site avant de saisir des informations personnelles ou de se connecter.",
        11: "Mauvaise réponse. Il existe une méthode de sécurité qui nécessite deux formes d'identification pour accéder à un compte, Cette méthode s'appelle l'authentification à deux facteurs (2FA).",
        12: "Mauvaise réponse. Soyez régulier dans vos sauvegardes.",
        13: "Mauvaise réponse. Faites attention à la provenance des applications que vous téléchargez.",
        14: "Mauvaise réponse. Un malware est un type de logiciel qui peut infiltrer, endommager ou perturber un système informatique.",
        15: "Mauvaise réponse ! Si l'adresse de messagerie a été usurpée, il faut immédiatement changer le mot de passe pour éviter que l'attaquant ne conserve l'accès au compte et ne continue à envoyer des messages frauduleux en votre nom. Si, par erreur, vous communiquez votre numéro de carte bancaire vous devez faire opposition auprès de votre banque et déposer plainte. Si vous identifiez une adresse de site d'hameçonnage (site qui peut voler des identifiants, infecter le système ou accéder au réseau) vous devez le signaler à Phishing Initiative (Plateforme de signalement et de prévention contre l'hameçonnage).",
        16: "Mauvaise réponse ! Si vous travaillez régulièrement à l'extérieur, évitez de vous connecter à un réseau Wi-Fi public, car ces réseaux sont souvent non sécurisés et peuvent permettre à des personnes malveillantes d'intercepter vos données. Si vous perdez ou vous vous faites voler votre téléphone, vous devez bloquer votre ligne en appelant votre opérateur et bloquer votre téléphone en communiquant votre code IMEI (identifiant unique de la puce réseau de votre appareil), puis déposer plainte. Si vous téléchargez un jeu sur votre téléphone, n'autorisez pas l'accès à vos photos, vos contacts et vos messages, car un jeu n'a aucune raison légitime d'accéder à ces données personnelles.",
        17: "Mauvaise réponse ! Si vous êtes à la maison et vous devez consulter vos messages professionnels, assurez-vous de le faire uniquement à partir de votre ordinateur professionnel. Si vous vous apprêtez à stocker des documents professionnels sur un service en ligne personnel, demandez l'autorisation à votre employeur et prenez des mesures de sécurité supplémentaires. Si ça vous arrive de réaliser des téléchargements illégaux depuis votre ordinateur professionnel, votre entreprise pourrait contrôler votre utilisation de la connexion Internet professionnelle et se retourner contre vous.",
        18: "Mauvaise réponse. Priorisez la sécurité de vos comptes en changeant immédiatement vos mots de passe et signaler l'incident.",
      }
    }
  },
  'moyen.html': {
    niveau: 'Moyen',
    lastQuizPage: 'moyen.html',
    flagStorageKey: 'quizFlags_moyen',
    quizAnswersKey: 'quizAnswers_moyen',
    questions: {
      q1: { correct: ['12'] },
      q2: { correct: ['segmentation'] },
      q3: { correct: ['2fa', 'unique'] },
      q4: { correct: ['urgent'] },
      q5: { correct: ['maj', 'permissions'] },
      q6: { correct: ['stocker'] },
      q7: { correct: ['rdp'] },
      q8: { correct: ['https', 'icone'] },
      q9: { correct: ['trafic', 'inconnus', 'ports'] },
      q10: { correct: ['permissions', 'editeur', 'taille'] },
      q11: { correct: ['least'] },
      q12: { correct: ['local+cloud'] },
      q13: { correct: ['changer'] },
      q14: { correct: ['protection'] },
      q18: { correct: ['compromission'] },
    },
    matchingQuestions: {
      15: { correctMap: { A: '1', B: '2', C: '3' } },
      16: { correctMap: { A: '3', B: '2', C: '1' } },
      17: { correctMap: { A: '2', B: '1', C: '3' } },
    },
    explications: {
      bonnes: {
        1: "Bonne réponse ! Pour un mot de passe fort, il est recommandé d'utiliser au moins 12 caractères, incluant des majuscules, des minuscules, des chiffres et des symboles.",
        2: "Bonne réponse ! La segmentation réseau permet de diviser un réseau en sous-réseaux plus petits, ce qui améliore la sécurité en limitant la propagation d'une attaque.",
        3: "Bonne réponse ! L'authentification à deux facteurs (2FA) ajoute une couche de sécurité supplémentaire en demandant une preuve d'identité supplémentaire, et l'utilisation de mots de passe uniques pour chaque compte réduit le risque d'accès non autorisé en cas de fuite de données.",
        4: "Bonne réponse ! Une demande urgente est un indicateur classique d'une tentative de phishing, car les attaquants cherchent à créer un sentiment d'urgence pour inciter les victimes à agir rapidement et sans réfléchir.",
        5: "Bonne réponse ! Maintenir les systèmes à jour avec les derniers correctifs de sécurité et restreindre les permissions des applications sont des mesures essentielles pour réduire la surface d'attaque et prévenir les accès non autorisés.",
        6: "Bonne réponse ! Un gestionnaire de mots de passe permet de stocker et de générer des mots de passe forts et uniques pour chaque compte, ce qui améliore considérablement la sécurité en réduisant le risque de réutilisation de mots de passe et en facilitant la gestion des identifiants.",
        7: "Bonne réponse ! Des connexions RDP inhabituelles entre machines internes peuvent être un indicateur d'une attaque par mouvement latéral, où un attaquant qui a compromis une machine tente de se déplacer latéralement à travers le réseau pour accéder à d'autres ressources.",
        8: "Bonne réponse ! L'utilisation de HTTPS et l'indication d'un icône cadenas dans la barre d'adresse sont des signes que la connexion est sécurisée.",
        9: "Bonne réponse ! Un trafic sortant inhabituel vers des pays étrangers, des appareils inconnus apparaissant sur le réseau, et des ports ouverts inattendus sur plusieurs machines sont tous des indicateurs potentiels d'une compromission du réseau.",
        10: "Bonne réponse ! Des permissions inhabituelles, un éditeur inconnu, ou une taille de fichier anormalement grande ou petite peuvent être des indicateurs d'une compromission ou d'une activité malveillante.",
        11: "Bonne réponse ! Le principe du moindre privilège consiste à accorder aux utilisateurs uniquement les permissions nécessaires pour accomplir leurs tâches, réduisant ainsi les risques.",
        12: "Bonne réponse ! Stocker une copie locale des données et une copie dans le cloud chiffré offre une protection contre la perte de données due à des incidents locaux (comme un vol ou un incendie) tout en assurant que les données sont sécurisées contre les accès non autorisés grâce au chiffrement.",
        13: "Bonne réponse ! Révoquer les sessions et changer les mots de passe est une mesure de sécurité importante en cas de compromission.",
        14: "Bonne réponse ! Protéger les données en cas de vol est crucial pour éviter que des informations sensibles ne tombent entre de mauvaises mains, ce qui peut entraîner des conséquences graves comme le vol d'identité.",
        15: "Bonne réponse ! Les données personnelles sont des informations permettant d'identifier une personne, même indirectement. Les données sensibles sont des catégories nécessitant une protection renforcée (santé, opinions, biométrie...). Les données confidentielles internes sont des informations métier non publiques (procédures, contrats, architecture IT).",
        16: "Bonne réponse ! Le principe du moindre privilège consiste à limiter les accès pour réduire l'impact d'un compte compromis. La journalisation centralisée est une détection plus rapide d'anomalies et corrélations d'évènements. La sensibilisation continue est une réduction du risque humain grâce à des rappels réguliers et contextualisés.",
        17: "Bonne réponse ! Le VPN (réseau virtuel) chiffre le traffic entre votre appareil et un serveur distant, il masque votre IP mais ne rend pas anonyme. Le chiffrement de bout en bout (E2EE) garantit que seuls l'expéditeur et le destinataire peuvent lire le message, même le serveur intermédiaire ne peut pas le déchiffrer. Le certificat SSL/TLS (cadenas HTTPS) chiffre les données en transit entre votre navigateur et le site web, il ne garantit pas que le site est légitime.",
        18: "Bonne réponse ! La compromission de la clé maître donnant accès à l'ensemble du coffre est un risque majeur en matière de sécurité.",
      },
      mauvaises: {
        1: "Mauvaise réponse. Il est recommandé d'utiliser au moins 12 caractères pour un mot de passe fort.",
        2: "Mauvaise réponse. La segmentation réseau consiste à diviser un réseau en sous-réseaux pour limiter les risques en cas de compromission.",
        3: "Mauvaise réponse. Évitez de partager et de réutiliser les mêmes mots de passe. Il faut plutôt ajouter une couche de sécurité supplémentaire avec l'authentification à deux facteurs (2FA), et utiliser un mot de passe unique pour chaque compte.",
        4: "Mauvaise réponse. Les attaquants cherchent à vous dépechez.",
        5: "Mauvaise réponse. La localisation et le Bluetooth activés en permanence peut être risqué. Maintenez les systèmes à jour avec les derniers correctifs de sécurité et restreignez les permissions des applications pour réduire les risques.",
        6: "Mauvaise réponse. Un gestionnaire de mots de passe est comme un coffre-fort pour vos mots de passe.",
        7: "Mauvaise réponse. L'indicateur qui permet le mieux de détecter une attaque par mouvement latéral dans un réseau d'entreprise est la présence de connexions RDP inhabituelles entre machines internes.",
        8: "Mauvaise réponse. Voyez ce qui est présent sur le site (https et icône cadenas).",
        9: "Mauvaise réponse. Des indicateurs potentiels d'une compromission du réseau incluent un trafic sortant inhabituel vers des pays étrangers, des appareils inconnus apparaissant sur le réseau, et des ports ouverts inattendus sur plusieurs machines.",
        10: "Mauvaise réponse. Pensez à ce qui semble le plus suspect, un éditeur inconnu, des permissions inhabituelles, ou une taille de fichier anormalement grande ou petite.",
        11: "Mauvaise réponse. Le principe du moindre privilège consiste à accorder aux utilisateurs uniquement les permissions nécessaires pour accomplir leurs tâches, réduisant ainsi les risques.",
        12: "Mauvaise réponse. Il est recommandé de stocker une copie locale des données et une copie dans le cloud chiffré pour assurer la sécurité et la disponibilité des données.",
        13: "Mauvaise réponse. Révoquer les sessions et changer les mots de passe est une mesure de sécurité importante en cas de compromission.",
        14: "Mauvaise réponse. Protéger vos données.",
        15: "Mauvaise réponse ! Les données personnelles sont des informations permettant d'identifier une personne, même indirectement. Les données sensibles sont des catégories nécessitant une protection renforcée (santé, opinions, biométrie...). Les données confidentielles internes sont des informations métier non publiques (procédures, contrats, architecture IT).",
        16: "Mauvaise réponse ! Le principe du moindre privilège consiste à limiter les accès pour réduire l'impact d'un compte compromis. La journalisation centralisée est une détection plus rapide d'anomalies et corrélations d'évènements. La sensibilisation continue est une réduction du risque humain grâce à des rappels réguliers et contextualisés.",
        17: "Mauvaise réponse ! Le VPN (réseau virtuel) chiffre le traffic entre votre appareil et un serveur distant, il masque votre IP mais ne rend pas anonyme. Le chiffrement de bout en bout (E2EE) garantit que seuls l'expéditeur et le destinataire peuvent lire le message. Le certificat SSL/TLS (cadenas HTTPS) chiffre les données en transit entre votre navigateur et le site web, il ne garantit pas que le site est légitime.",
        18: "Mauvaise réponse. Le risque majeur en matière de sécurité est la compromission de la clé maître donnant accès à l'ensemble du coffre.",
      }
    }
  },
  'difficile.html': {
    niveau: 'Difficile',
    lastQuizPage: 'difficile.html',
    flagStorageKey: 'quizFlags_difficile',
    quizAnswersKey: 'quizAnswers_difficile',
    questions: {
      q1: { correct: ['sslv3'] },
      q2: { correct: ['sortie'] },
      q3: { correct: ['param', 'validation'] },
      q4: { correct: ['oneway'] },
      q5: { correct: ['unique'] },
      q6: { correct: ['csp'] },
      q7: { correct: ['nepasfaireconfiance'] },
      q8: { correct: ['fournisseur'] },
      q9: { correct: ['identite'] },
      q10: { correct: ['samekey'] },
      q11: { correct: ['connaissance', 'possession', 'biometrie'] },
      q12: { correct: ['vault', 'rotation'] },
      q13: { correct: ['privilege'] },
      q14: { correct: ['pinning'] },
      q18: { correct: ['chaine'] },
    },
    matchingQuestions: {
      15: { correctMap: { A: '1', B: '3', C: '2' } },
      16: { correctMap: { A: '1', B: '2', C: '3' } },
      17: { correctMap: { A: '3', B: '2', C: '1' } },
    },
    explications: {
      bonnes: {
        1: "Bonne réponse ! Utiliser un protocole de chiffrement obsolète comme SSLv3 expose les données à des vulnérabilités connues, ce qui peut permettre à des attaquants d'intercepter et de déchiffrer les informations sensibles transmises entre le client et le serveur.",
        2: "Bonne réponse ! Échapper les données avant l'affichage côté sortie est une mesure de sécurité essentielle pour prévenir les attaques de type cross-site scripting (XSS), car elle permet de neutraliser les caractères spéciaux et les scripts malveillants qui pourraient être injectés dans une page web, protégeant ainsi les utilisateurs contre l'exécution de code malveillant dans leur navigateur.",
        3: "Bonne réponse ! La validation côté serveur est essentielle pour garantir la sécurité des applications web, car elle permet de vérifier et de filtrer les données entrantes, empêchant ainsi les attaques telles que l'injection SQL, les scripts intersites (XSS) et d'autres formes de manipulation de données malveillantes.",
        4: "Bonne réponse ! Utiliser une fonction de hachage à sens unique pour stocker les mots de passe est une pratique de sécurité essentielle, car elle permet de protéger les mots de passe des utilisateurs en les transformant en une valeur hachée qui ne peut pas être inversée, ce qui rend extrêmement difficile pour les attaquants de récupérer les mots de passe d'origine même s'ils parviennent à accéder à la base de données.",
        5: "Bonne réponse ! La caractéristique qui distingue un jeton anti-CSRF efficace est qu'il doit être unique pour chaque session ou chaque requête, ce qui permet de garantir que les requêtes proviennent bien de l'utilisateur légitime et de prévenir les attaques de type cross-site request forgery (CSRF) en rendant difficile pour les attaquants de prédire ou de réutiliser des jetons valides.",
        6: "Bonne réponse ! Mettre en place une politique de sécurité du contenu (Content Security Policy - CSP) est une mesure efficace pour prévenir les attaques de type cross-site scripting (XSS), car elle permet de contrôler les sources de contenu autorisées et de limiter l'exécution de scripts malveillants sur une page web.",
        7: "Bonne réponse ! Il est important de ne pas faire confiance à des sources d'information non vérifiées, car elles peuvent diffuser des informations erronées ou biaisées, ce qui peut conduire à de mauvaises décisions ou à la propagation de fausses informations.",
        8: "Bonne réponse ! Faire confiance à un fournisseur de paiement réputé est un indicateur clé de la sécurité d'un site de commerce en ligne, car ces fournisseurs mettent en place des mesures de sécurité robustes pour protéger les informations de paiement des clients et réduire les risques de fraude.",
        9: "Bonne réponse ! Vérifier l'identité du destinataire avant d'envoyer des informations sensibles est crucial pour éviter les attaques de phishing et les fraudes, car cela permet de s'assurer que les données sont envoyées à la bonne personne ou organisation et non à un imposteur malveillant.",
        10: "Bonne réponse ! Utiliser la même clé de chiffrement pour plusieurs données sensibles peut compromettre la sécurité, car si un attaquant parvient à découvrir cette clé, il pourra potentiellement accéder à toutes les données protégées par cette clé, augmentant ainsi les risques de fuite d'informations et de compromission de la confidentialité.",
        11: "Bonne réponse ! Les trois facteurs d'authentification sont : la connaissance (quelque chose que vous savez, comme un mot de passe), la possession (quelque chose que vous avez, comme un téléphone ou une carte) et la biométrie (quelque chose que vous êtes, comme une empreinte digitale ou une reconnaissance faciale). Utiliser plusieurs facteurs d'authentification renforce la sécurité en rendant plus difficile pour les attaquants de compromettre un compte.",
        12: "Bonne réponse ! Utiliser un gestionnaire de mots de passe (vault) et pratiquer la rotation régulière des mots de passe sont des pratiques essentielles pour maintenir la sécurité des comptes en ligne, car elles permettent de stocker les mots de passe de manière sécurisée et de réduire les risques associés à l'utilisation prolongée d'un même mot de passe, qui peut être compromis au fil du temps.",
        13: "Bonne réponse ! Un rootkit est un type de logiciel malveillant conçu pour donner à un attaquant un accès privilégié et furtif à un système compromis, souvent en cachant sa présence et en permettant à l'attaquant de contrôler le système à distance sans être détecté.",
        14: "Bonne réponse ! Le pinning de certificat est une technique de sécurité qui consiste à associer un certificat spécifique à une application ou un site web, ce qui permet de prévenir les attaques de type man-in-the-middle en s'assurant que l'application ou le site web ne communique qu'avec des serveurs présentant le certificat attendu, même si un attaquant parvient à compromettre une autorité de certification ou à intercepter les communications.",
        15: "Bonne réponse ! Le reserve phishing est une menace où l'attaquant pousse la victime à initer elle-même le contact (ex: faux support). Le pretexting technique est une menace où l'attaquant se fait passer pour un outil ou un système automatisé. La session mirroring est une menace où l'attaquant observe passivement une session légitime via un accès détourné.",
        16: "",
        17: "Bonne réponse ! Quand vous recevez une alerte &quot;nouvelle connexion depuis un pays étranger&quot; alors que vous êtes au bureau. C'est un test d'identifiants compromis sur un VPN ou un service exposé. Quand le Wi-Fi invité devient soudainement très lent, alors que peu de monde est connecté. C'est un scan ou une tentative d'exploitation depuis un appareil connecté au réseau invité. Quand un serveur interne commence à générer beaucoup plus de trafic sortant que d'habitude. C'est une exfiltration de données via un tunnel chiffré mis en place par un attaquant.",
        18: "Bonne réponse ! L'action qui est la plus pertinente pour vérifier la validité d'un certificat TLS est de vérifier la chaîne de certification, c'est-à-dire s'assurer que le certificat présenté par le serveur est émis par une autorité de certification de confiance et que la chaîne de certificats est complète et valide.",
      },
      mauvaises: {
        1: "Mauvaise réponse. Il s'agit d'un protocole de chiffrement obsolète qui se nomme SSLv3.",
        2: "Mauvaise réponse. Échapper les données avant l'affichage côté sortie est une mesure de sécurité essentielle pour prévenir les attaques de type cross-site scripting (XSS).",
        3: "Mauvaise réponse. Il s'agit de deux étapes clés pour sécuriser les données entrantes dans une application web. La validation côté serveur et utiliser des requêtes paramétrées.",
        4: "Mauvaise réponse. Utiliser une fonction de hachage à sens unique pour stocker les mots de passe est une pratique de sécurité essentielle, car elle permet de protéger les mots de passe des utilisateurs en les transformant en une valeur hachée qui ne peut pas être inversée, ce qui rend extrêmement difficile pour les attaquants de récupérer les mots de passe d'origine même s'ils parviennent à accéder à la base de données.",
        5: "Mauvaise réponse. La caractéristique qui distingue un jeton anti-CSRF efficace est qu'il doit être unique pour chaque session ou chaque requête, ce qui permet de garantir que les requêtes proviennent bien de l'utilisateur légitime et de prévenir les attaques de type cross-site request forgery (CSRF) en rendant difficile pour les attaquants de prédire ou de réutiliser des jetons valides.",
        6: "Mauvaise réponse. Il s'agit d'une mesure de sécurité qui permet de contrôler les sources de contenu autorisées sur une page web (Content Security Policy - CSP).",
        7: "Mauvaise réponse. Il ne faut pas faire confiance à des sources d'information non vérifiées.",
        8: "Mauvaise réponse. Il s'agit d'un indicateur clé de la sécurité d'un site de commerce en ligne : faire confiance à un fournisseur de paiement réputé.",
        9: "Mauvaise réponse. Vérifier l'identité du destinataire avant d'envoyer des informations sensibles est crucial pour éviter les attaques de phishing et les fraudes.",
        10: "Mauvaise réponse. Utiliser la même clé de chiffrement pour plusieurs données sensibles peut compromettre la sécurité, car si un attaquant parvient à découvrir cette clé, il pourra potentiellement accéder à toutes les données protégées par cette clé.",
        11: "Mauvaise réponse. Il s'agit de trois catégories de facteurs d'authentification qui renforcent la sécurité des comptes en ligne. La connaissance, la possession et la biométrie.",
        12: "Mauvaise réponse. Utiliser un gestionnaire de mots de passe (vault) et pratiquer la rotation régulière des mots de passe sont des pratiques essentielles pour maintenir la sécurité des comptes en ligne.",
        13: "Mauvaise réponse. Un rootkit est un type de logiciel conçu pour donner à un attaquant un accès privilégié et furtif à un système compromis.",
        14: "Mauvaise réponse. Le pinning de certificat est une technique de sécurité qui consiste à associer un certificat spécifique à une application ou un site web pour prévenir les attaques de type man-in-the-middle.",
        15: "Mauvaise réponse ! Le reserve phishing est une menace où l'attaquant pousse la victime à initer elle-même le contact. Le pretexting technique est une menace où l'attaquant se fait passer pour un outil ou un système automatisé. La session mirroring est une menace où l'attaquant observe passivement une session légitime via un accès détourné.",
        16: "",
        17: "Mauvaise réponse ! Quand vous recevez une alerte &quot;nouvelle connexion depuis un pays étranger&quot; alors que vous êtes au bureau. C'est un test d'identifiants compromis sur un VPN ou un service exposé. Quand le Wi-Fi invité devient soudainement très lent, alors que peu de monde est connecté. C'est un scan ou une tentative d'exploitation depuis un appareil connecté au réseau invité. Quand un serveur interne commence à générer beaucoup plus de trafic sortant que d'habitude. C'est une exfiltration de données via un tunnel chiffré mis en place par un attaquant.",
        18: "Mauvaise réponse. L'action qui est la plus pertinente pour vérifier la validité d'un certificat TLS est de vérifier la chaîne de certification, c'est-à-dire s'assurer que le certificat présenté par le serveur est émis par une autorité de certification de confiance et que la chaîne de certificats est complète et valide.",
      }
    }
  },
};

const pageConfig = pageConfigs[pageName] || pageConfigs['facile.html'];

let score = 0;
const state = {};
let quizReview = [];
let quizFlags = {};
let quizAnswers = {};
let questionOrder = [];

// Fonction pour charger l'état des flags de révision depuis le localStorage
function loadQuizFlags() {
  try {
    quizFlags = JSON.parse(localStorage.getItem(pageConfig.flagStorageKey) || '{}');
  } catch (e) {
    quizFlags = {};
    console.error('Impossible de charger l\'état des flags', e);
  }
}

// Fonction pour charger l'état sauvegardé du quiz (score, review, réponses sélectionnées) depuis le localStorage
function loadSavedQuizState() {
  try {
    quizReview = JSON.parse(localStorage.getItem('quizReview') || '[]');
  } catch (e) {
    quizReview = [];
  }
  try {
    quizAnswers = JSON.parse(localStorage.getItem(pageConfig.quizAnswersKey) || '{}');
  } catch (e) {
    quizAnswers = {};
  }
  const storedScore = parseInt(localStorage.getItem('quizScore'), 10);
  if (!Number.isNaN(storedScore)) {
    score = storedScore;
  }
}

// Fonction pour sauvegarder les réponses sélectionnées par l'utilisateur dans le localStorage, afin de les restaurer en cas de retour à une question déjà répondue
function saveQuizAnswers() {
  localStorage.setItem(pageConfig.quizAnswersKey, JSON.stringify(quizAnswers));
}

// Fonction pour restaurer les réponses sélectionnées par l'utilisateur lorsqu'il revient sur une question déjà répondue, en cochant les cases correspondantes
function restoreSavedAnswers(questionId) {
  const selected = quizAnswers[questionId];
  if (!Array.isArray(selected)) return;
  const inputs = document.querySelectorAll(`input[name="${questionId}"]`);
  inputs.forEach(input => {
    input.checked = selected.includes(input.value);
  });
}

// Fonction pour recalculer le score à partir de la revue
function recomputeScoreFromReview() {
  score = quizReview.filter(entry => entry.correct).length;
  updateScore();
  localStorage.setItem('quizScore', String(score));
}

// Fonction pour éditer le contenu d'une question, utilisée depuis la page de résultats pour permettre à l'utilisateur de corriger une question mal comprise
function editQuizQuestion(questionId, newContent) {
  const question = document.getElementById(questionId);
  if (question) {
    question.innerHTML = newContent;
  }
}

// Fonction pour sauvegarder l'état des flags de révision dans le localStorage, afin de les restaurer lors du prochain chargement de la page
function saveQuizFlags() {
  localStorage.setItem(pageConfig.flagStorageKey, JSON.stringify(quizFlags));
}

// Fonction pour mettre à jour l'interface d'une question en fonction de son état de flag de révision, en changeant le texte du bouton et la classe CSS de la question
function updateFlagUI(questionId) {
  const question = document.getElementById(questionId);
  if (!question) return;
  const btn = question.querySelector('.flag-btn');
  const flagged = Boolean(quizFlags[questionId]);
  if (btn) {
    btn.textContent = flagged ? 'Retirer le marqueur' : 'Marquer cette question à revoir';
    btn.setAttribute('aria-pressed', String(flagged));
  }
  question.classList.toggle('flagged', flagged);
}

// Fonction pour initialiser les boutons de flag de révision sur chaque question, en les créant s'ils n'existent pas et en configurant leur comportement au clic pour basculer l'état de flag de la question et mettre à jour l'interface en conséquence
function initFlagButtons() {
  document.querySelectorAll('.question').forEach(question => {
    const questionId = question.id;

    if (!question.querySelector('.flag-btn')) {
      const validerBtn = document.getElementById(`btn-valider-${questionId}`);
      const flagBtn = document.createElement('button');
      flagBtn.type = 'button';
      flagBtn.className = 'flag-btn';
      flagBtn.dataset.questionId = questionId;
      flagBtn.addEventListener('click', () => {
        quizFlags[questionId] = !Boolean(quizFlags[questionId]);
        saveQuizFlags();
        updateFlagUI(questionId);
      });

      if (validerBtn && validerBtn.parentNode) {
        validerBtn.parentNode.insertBefore(flagBtn, validerBtn.nextSibling);
      } else {
        question.appendChild(flagBtn);
      }
    }

    const btn = question.querySelector('.flag-btn');
    if (btn) {
      btn.textContent = Boolean(quizFlags[questionId]) ? 'Retirer le marqueur' : 'Marquer cette question à revoir';
      btn.setAttribute('aria-pressed', String(Boolean(quizFlags[questionId])));
    }
    updateFlagUI(questionId);
  });
}

// Ordre aléatoire des questions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialise l'ordre aléatoire des questions et configure les boutons "Suivant" en conséquence
function initRandomQuestions() {
  const qs = Array.from(document.querySelectorAll('.question')).map(q => q.id);
  if (!qs.length) return;
  questionOrder = shuffle(qs);

  questionOrder.forEach((id, idx) => {
    const nextBtn = document.getElementById(`btn-suivant-${id}`);
    if (nextBtn) {
      if (idx < questionOrder.length - 1) {
        nextBtn.onclick = () => showQuestion(questionOrder[idx + 1]);
      } else {
        nextBtn.onclick = goToResults;
        nextBtn.textContent = 'Voir les résultats';
      }
    }
  });

  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
  document.getElementById(questionOrder[0]).style.display = 'block';
  
  const progress = document.getElementById('progress');
  if (progress) progress.max = questionOrder.length;
  
  updateProgress(questionOrder[0]);
}

function melangerReponses(questionId) {
  if (['q15', 'q16', 'q17'].includes(questionId)) return; // Les questions ou il faut relier des éléments ne sont pas mélangées

  const conteneur = document.getElementById(questionId);
  const labels = Array.from(conteneur.querySelectorAll('label'));

  const paires = labels.map(label => {
    const br = label.nextSibling?.nodeName === 'BR' ? label.nextSibling : null;
    return { label, br };
  });

  paires.forEach(({ label, br }) => {
    if (br) br.remove();
    label.remove();
  });

  shuffle(paires);

  const ancre = conteneur.querySelector('h3');
  paires.forEach(({ label }) => {
    ancre.insertAdjacentElement('afterend', label);
    label.insertAdjacentElement('afterend', document.createElement('br'));
  });
}

window.addEventListener('load', () => {
  loadSavedQuizState();
  loadQuizFlags();
  initFlagButtons();
  initRandomQuestions();
}); // Initialise les questions aléatoires au chargement de la page

// Si on est revenu depuis la page de résultats pour éditer une question,
// afficher directement cette question
window.addEventListener('load', () => {
  const editQuestionId = localStorage.getItem('editQuestionId');
  if (editQuestionId) {
    // Afficher la question demandée
    try {
      showQuestion(editQuestionId);
      restoreSavedAnswers(editQuestionId);
    } catch (e) {
      console.warn('Impossible d\'afficher la question demandée:', editQuestionId, e);
    }
  }
});

async function goToResults() {
  localStorage.setItem('lastQuizPage', pageConfig.lastQuizPage);
  // Vérifier que le score affiché correspond au score calculé
  const scoreEl = document.getElementById('score');
  let displayed = score;
  if (scoreEl) {
    const parsed = parseInt((scoreEl.textContent || '').replace(/\D/g, ''), 10);
    if (!Number.isNaN(parsed)) displayed = parsed;
  }
  if (displayed !== score) {
    console.warn('Score affiché différent du score interne, envoi du score affiché :', displayed, 'interne:', score);
    score = displayed;
    updateScore();
  }

  const confirmed = confirm('Voulez-vous définitivement valider vos réponses et souhaitez-vous envoyer votre score au serveur ?');
  if (confirmed) {
    try {
      await envoyerScore(joueurNom, score, pageConfig.niveau, 18);
    } catch (e) {
      console.error('Erreur lors de l\'envoi du score :', e);
    }
  }

  localStorage.setItem('quizReview', JSON.stringify(quizReview));
  localStorage.setItem('quizScore', String(score));
  localStorage.setItem('quizNiveau', pageConfig.niveau);
  localStorage.setItem('quizNom', joueurNom);
  localStorage.setItem('quizTotal', '18');
  // Enregistrer dans l'historique global des résultats
  try {
    const hist = JSON.parse(localStorage.getItem('quizResults') || '[]');
    hist.push({ nom: joueurNom, niveau: pageConfig.niveau, score: score, total: 18, date: new Date().toISOString() });
    localStorage.setItem('quizResults', JSON.stringify(hist));
  } catch (e) {
    console.error('Impossible de sauvegarder l\'historique des résultats', e);
  }
  window.location.href = 'resultats.html';
}

// Affiche la question dont l'id est passé en paramètre et cache les autres, tout en mettant à jour la barre de progression et en redimensionnant les canvas si nécessaire
function showQuestion(id) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');  // On récupère toutes les divs de la classe "question" et on les cache
  document.getElementById(id).style.display = 'block';  // On affiche uniquement la question dont l'id est passé en paramètre
  
  // Vide les messages de résultat quand on change de question
  ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14','q15', 'q16', 'q17'].forEach(qid => {
    if (id !== qid) {
      const r = document.getElementById(`result-${qid}`);
      if (r) r.textContent = '';
    }
  });

  // Les canvas ont une taille 0 quand leur question est cachée,
  // il faut donc les redimensionner au moment où elles deviennent visibles
  const match = id.match(/^q(15|16|17)$/);
  if (match) {
    const n = match[1];
    resizeCanvas(n);
    redraw(n);
  }

  restoreSavedAnswers(id);
  updateProgress(id);
  melangerReponses(id);
}

function showNextQuestion(currentId) {
  const idx = questionOrder.indexOf(currentId);
  if (idx < 0) return;
  if (idx < questionOrder.length - 1) {
    showQuestion(questionOrder[idx + 1]);
  } else {
    goToResults();
  }
}

function recordQuestionReview(questionId, selected, resultText, correct) {
  const reviewEntry = {
    questionId,
    selected: selected && selected.length ? selected.join(', ') : 'Aucune réponse',
    result: resultText,
    correct,
  };
  quizReview = quizReview.filter(entry => entry.questionId !== questionId);
  quizReview.push(reviewEntry);
  localStorage.setItem('quizReview', JSON.stringify(quizReview));
  quizAnswers[questionId] = Array.isArray(selected) ? selected : [];
  saveQuizAnswers();
  recomputeScoreFromReview();
  // Si on est en mode édition depuis la page de résultats, revenir automatiquement
  if (localStorage.getItem('backToResults') === '1') {
    localStorage.removeItem('backToResults');
    localStorage.removeItem('editQuestionId');
    window.location.href = 'resultats.html';
  }
}

function showResult(id) {
  document.querySelectorAll('.result').forEach(r => r.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  updateProgress(id);
}

// Fonction générique de vérification pour les questions 1-14 et 18
function checkQuestion(questionId) {
    // Vérifier que pageConfig est défini
    if (typeof pageConfig === 'undefined') {
        console.error('pageConfig is not defined yet. Page config:', typeof pageConfig);
        alert('Le script n\'est pas encore chargé. Veuillez attendre.');
        return;
    }
    
    const selected = Array.from(document.querySelectorAll(`input[name="${questionId}"]:checked`))
                          .map(el => el.value);
    
    const correct = pageConfig.questions[questionId].correct;
    const result = document.getElementById(`result-${questionId}`);
    const n = parseInt(questionId.replace('q', ''), 10);
    
    if (arraysEqual(selected, correct)) {
        result.textContent = pageConfig.explications.bonnes[n] || "Bonne réponse !";
        result.style.color = "green";
        recordQuestionReview(questionId, selected, result.textContent, true);
        document.getElementById(`btn-valider-${questionId}`).style.display = "none";
        document.getElementById(`btn-suivant-${questionId}`).style.display = "inline-block";
    } else {
        result.textContent = pageConfig.explications.mauvaises[n] || "Mauvaise réponse.";
        result.style.color = "red";
        recordQuestionReview(questionId, selected, result.textContent, false);
        document.getElementById(`btn-valider-${questionId}`).style.display = "none";
        setTimeout(() => showNextQuestion(questionId), 2000);
    }
    updateScore();
}




// a = réponses cochées par l'utilisateur
// b = bonnes réponses définies dans le code
// La fonction compare les deux tableaux pour vérifier si la réponse est correcte
function arraysEqual(a, b) {
    return a.length === b.length && a.every(v => b.includes(v));
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Score : ${score}`;
    }
}
updateScore();

// Fonction qui génère un résumé de la question avec les réponses sélectionnées et le résultat affiché, pour l'export des résultats
function getQuestionSummary(questionNumber) {
    const selected = Array.from(document.querySelectorAll(`input[name="q${questionNumber}"]:checked`))
                          .map(el => el.value);
    const answerText = selected.length ? selected.join(', ') : 'Aucune réponse';
    const resultText = document.getElementById(`result-q${questionNumber}`)?.textContent || 'Pas de résultat';
    return `Question ${questionNumber}: ${answerText}\nRésultat: ${resultText}`;
}

function exportResults() {
    const niveau = pageConfig.niveau;
    const lines = [
        `Nom : ${joueurNom}`,
        `Niveau : ${niveau}`,
        `Score : ${score}/18`,
        '',
        'Détail des réponses :'
    ];
    for (let i = 1; i <= 18; i++) {
        lines.push(getQuestionSummary(i));
        lines.push('');
    }

    const fileContent = lines.join('\n');
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `resultats_${niveau.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const subject = encodeURIComponent(`Résultats questionnaire ${niveau}`);
    const body = encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-joint le fichier de mes résultats.\n\nNom : ${joueurNom}\nNiveau : ${niveau}\nScore : ${score}/18\n\nMerci.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

//Fonction qui permet de vérifier la réponse de la question 1
function checkQ1() {
    checkQuestion('q1');
}

//Fonction qui permet de vérifier la réponse de la question 2
function checkQ2() {
    checkQuestion('q2');
}

// Fonction qui permet de vérifier la réponse de la question 3
function checkQ3() {
    checkQuestion('q3');
}

// Fonction qui permet de vérifier la réponse de la question 4
function checkQ4() {
    checkQuestion('q4');
}

// Fonction qui permet de vérifier la réponse de la question 5
function checkQ5() {
    checkQuestion('q5');
}

// Fonction qui permet de vérifier la réponse de la question 6
function checkQ6() {
    checkQuestion('q6');
}

// Fonction qui permet de vérifier la réponse de la question 7
function checkQ7() {
    checkQuestion('q7');
}

// Fonction qui permet de vérifier la réponse de la question 8
function checkQ8() {
    checkQuestion('q8');
}

// Fonction qui permet de vérifier la réponse de la question 9
function checkQ9() {
    checkQuestion('q9');
}

// Fonction qui permet de vérifier la réponse de la question 10
function checkQ10() {
    checkQuestion('q10');
}

// Fonction qui permet de vérifier la réponse de la question 11
function checkQ11() {
    checkQuestion('q11');
}

// Fonction qui permet de vérifier la réponse de la question 12
function checkQ12() {
    checkQuestion('q12');
}

// Fonction qui permet de vérifier la réponse de la question 13
function checkQ13() {
    checkQuestion('q13');
}

// Fonction qui permet de vérifier la réponse de la question 14
function checkQ14() {
    checkQuestion('q14');
}

//Q15 / Q16 / Q17
//Bonnes réponses : clé = bloc gauche (A/B/C), valeur = bloc droit attendu (1/2/3)
const configs = pageConfig.matchingQuestions;


// Canvas

// Ajuste la taille du canvas à celle de son conteneur
function resizeCanvas(n) {
  const s = state[n];
  s.canvas.width  = document.getElementById(`conteneur${n}`).clientWidth;
  s.canvas.height = document.getElementById(`conteneur${n}`).clientHeight;
}

// Efface et redessine toutes les connexions (bleu = correct, rouge = incorrect)
function redraw(n) {
  const { canvas, ctx, connexions } = state[n];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 3;

  connexions.forEach(c => {
    const blocG = document.querySelector(`.gauche${n} .bloc${n}[data-id="${c.left}"]`);
    const blocD = document.querySelector(`.droite${n} .bloc${n}[data-id="${c.right}"]`);
    const cont  = document.getElementById(`conteneur${n}`).getBoundingClientRect();

    const center = el => {
      const r = el.getBoundingClientRect();
      return { x: r.left - cont.left + r.width / 2, y: r.top - cont.top + r.height / 2 };
    };

    ctx.strokeStyle = c.correct === false ? "#e74c3c" : "#3498db";
    ctx.beginPath();
    ctx.moveTo(...Object.values(center(blocG)));
    ctx.lineTo(...Object.values(center(blocD)));
    ctx.stroke();
  });
}


window.addEventListener('load', () => {
  [15, 16, 17].forEach(n => {
    const canvas = document.getElementById(`lignes${n}`);
    state[n] = { canvas, ctx: canvas.getContext("2d"), connexions: [], selected: null };

    resizeCanvas(n);
    window.addEventListener("resize", () => { resizeCanvas(n); redraw(n); });

    //Clic sur un bloc gauche : le sélectionne comme point de départ
    document.querySelectorAll(`.gauche${n} .bloc${n}`).forEach(bloc => {
      bloc.addEventListener("click", () => {
        document.querySelectorAll(`.gauche${n} .bloc${n}`).forEach(b => b.classList.remove("selected"));
        bloc.classList.add("selected");
        state[n].selected = bloc.dataset.id;
      });
    });

    //Clic sur un bloc droit : crée la connexion avec le bloc gauche sélectionné
    document.querySelectorAll(`.droite${n} .bloc${n}`).forEach(bloc => {
      bloc.addEventListener("click", () => {
        if (!state[n].selected) return;

        //Remplace une éventuelle connexion existante pour ce bloc gauche
        state[n].connexions = state[n].connexions.filter(c => c.left !== state[n].selected);
        state[n].connexions.push({ left: state[n].selected, right: bloc.dataset.id, correct: null });

        document.querySelectorAll(`.gauche${n} .bloc${n}`).forEach(b => b.classList.remove("selected"));
        state[n].selected = null;
        redraw(n);
      });
    });

    //Validation : vérifie chaque connexion et met à jour score + affichage
    document.getElementById(`btn-valider-q${n}`).addEventListener("click", () => {
      const { correctMap } = configs[n];
      let bonnes = 0;

      state[n].connexions.forEach(c => {
        c.correct = c.right === correctMap[c.left];
        if (c.correct) bonnes++;
      });
      redraw(n); //Redessine en rouge (faux) ou bleu (vrai)

      const result = document.getElementById(`result-q${n}`);
      if (bonnes === 3) {
        result.textContent = pageConfig.explications.bonnes[n] || "Bonne réponse !";
        result.style.color = "green";
        score++;
        recordQuestionReview(`q${n}`, [], result.textContent, true);
        document.getElementById(`btn-valider-q${n}`).style.display = "none";
        document.getElementById(`btn-suivant-q${n}`).style.display = "inline-block";
      } else {
        result.textContent = pageConfig.explications.mauvaises[n] || "Mauvaise réponse.";
        result.style.color = "red";
        recordQuestionReview(`q${n}`, [], result.textContent, false);
        document.getElementById(`btn-valider-q${n}`).style.display = "none";
        setTimeout(() => showNextQuestion(`q${n}`), 2000);
      }
      updateScore();
    });
  });
});

// Fonction qui permet de vérifier la réponse de la question 18
function checkQ18() {
    checkQuestion('q18');
}

// Envoi du score au serveur (à appeler à la fin du questionnaire)
async function envoyerScore(nom, score, niveau, total) {
  try {
    await fetch('http://localhost:3001/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, score, niveau, total })
    });
    console.log('Score envoyé avec succès');
  } catch (error) {
    console.error('Erreur envoi score :', error);
  }
}

// Met à jour la barre de progression et le texte associé
function updateProgress(questionId) {
  const progress = document.getElementById('progress');
  const progressText = document.getElementById('progress-text');
  const currentIndex = questionOrder.indexOf(questionId) + 1;

  if (progress && progressText && currentIndex > 0) {
    progress.value = currentIndex;
    progressText.textContent = `${currentIndex}/${questionOrder.length}`;
  }
}