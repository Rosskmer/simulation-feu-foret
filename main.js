// Charger la configuration depuis config.json
fetch('config.json')
    .then(response => response.json())
    .then(config => {
        const ligne = config.ligne;
        const colonne = config.colonne;
        const probabilitePropagation = config.probabilitePropagation;
        const casesEnFeu = config.casesEnFeu;

        
        const grilleHtml = document.getElementById('grille');
        grilleHtml.style.setProperty('--ligne', ligne);
        grilleHtml.style.setProperty('--colonne', colonne);

        let grille = [];

        
        for (let i = 0; i < ligne; i++) {
            grille[i] = [];
            for (let j = 0; j < colonne; j++) {
                grille[i][j] = "arbre"; 
                const caseDiv = document.createElement('div');
                caseDiv.className = 'case case-arbre';
                grilleHtml.appendChild(caseDiv);
            }
        }

        
        casesEnFeu.forEach(caseFeu => {
            grille[caseFeu.ligne][caseFeu.colonne] = "feu";
            const caseDiv = grilleHtml.children[caseFeu.ligne * colonne + caseFeu.colonne];
            caseDiv.classList.remove('case-arbre');
            caseDiv.classList.add('case-feu');
        });

        
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

       
        function propagerFeu(grilleTemp, i, j) {
            const directions = [
                { di: -1, dj: 0 }, 
                { di: 1, dj: 0 },  
                { di: 0, dj: -1 }, 
                { di: 0, dj: 1 }   
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

        
        const simulationInterval = setInterval(mettreAJourGrille, 500);
    });
