// Charger la configuration depuis config.json
fetch('config.json')
    .then(response => response.json())
    .then(config => {
        const ligne = config.ligne;
        const colonne = config.colonne;
        const probabilitePropagation = config.probabilitePropagation;
        const casesEnFeu = config.casesEnFeu;

        // Initialiser la grille HTML
        const grilleHtml = document.getElementById('grille');
        grilleHtml.style.setProperty('--ligne', ligne);
        grilleHtml.style.setProperty('--colonne', colonne);

        let grille = [];

        // Créer la grille initiale
        for (let i = 0; i < ligne; i++) {
            grille[i] = [];
            for (let j = 0; j < colonne; j++) {
                grille[i][j] = "arbre"; // Initialiser toutes les cases comme des arbres
                const caseDiv = document.createElement('div');
                caseDiv.className = 'case case-arbre';
                grilleHtml.appendChild(caseDiv);
            }
        }

        // Mettre les cases initialement en feu
        casesEnFeu.forEach(caseFeu => {
            grille[caseFeu.ligne][caseFeu.colonne] = "feu";
            const caseDiv = grilleHtml.children[caseFeu.ligne * colonne + caseFeu.colonne];
            caseDiv.classList.remove('case-arbre');
            caseDiv.classList.add('case-feu');
        });

        // Fonction pour mettre à jour la grille à chaque étape de simulation
        function mettreAJourGrille() {
            let nouvelleGrille = JSON.parse(JSON.stringify(grille));

            for (let i = 0; i < ligne; i++) {
                for (let j = 0; j < colonne; j++) {
                    if (grille[i][j] === "feu") {
                        propagerFeu(nouvelleGrille, i, j);
                    }
                }
            }

            grille = nouvelleGrille;
            afficherGrille();
        }

        // Fonction pour propager le feu aux cases adjacentes
        function propagerFeu(grilleTemp, i, j) {
            const directions = [
                { di: -1, dj: 0 }, // haut
                { di: 1, dj: 0 },  // bas
                { di: 0, dj: -1 }, // gauche
                { di: 0, dj: 1 }   // droite
            ];

            for (const dir of directions) {
                const ni = i + dir.di;
                const nj = j + dir.dj;

                if (ni >= 0 && ni < ligne && nj >= 0 && nj < colonne) {
                    if (Math.random() <= probabilitePropagation && grilleTemp[ni][nj] === "arbre") {
                        grilleTemp[ni][nj] = "feu";
                        const caseDiv = grilleHtml.children[ni * colonne + nj];
                        caseDiv.classList.remove('case-arbre');
                        caseDiv.classList.add('case-feu');
                    }
                }
            }

            grilleTemp[i][j] = "cendres";
            const caseDiv = grilleHtml.children[i * colonne + j];
            caseDiv.classList.remove('case-feu');
            caseDiv.classList.add('case-cendres');
        }

        // Fonction pour afficher l'état actuel de la grille dans le HTML
        function afficherGrille() {
            for (let i = 0; i < ligne; i++) {
                for (let j = 0; j < colonne; j++) {
                    const caseDiv = grilleHtml.children[i * colonne + j];
                    caseDiv.className = 'case';
                    if (grille[i][j] === "arbre") {
                        caseDiv.classList.add('case-arbre');
                    } else if (grille[i][j] === "feu") {
                        caseDiv.classList.add('case-feu');
                    } else if (grille[i][j] === "cendres") {
                        caseDiv.classList.add('case-cendres');
                    }
                }
            }
        }

        // Exécuter la simulation à intervalles réguliers (par exemple, toutes les 500 ms)
        const simulationInterval = setInterval(mettreAJourGrille, 500);
    });
