import React, { useState, useEffect } from 'react';
import { Search, Bug, Leaf, ChevronDown, ChevronUp } from 'lucide-react';

const DiseaseInsectReference = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState({});
  const [diseases, setDiseases] = useState([]);
  const [insects, setInsects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock API call - replace with actual API endpoints
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API calls
        const mockDiseases = [
          {
            id: 1,
            name: 'Mildiou',
            scientificName: 'Plasmopara viticola',
            description: 'Maladie fongique causant des taches huileuses sur les feuilles',
            symptoms: ['Taches huileuses jaunâtres', 'Duvet blanc sous les feuilles', 'Brunissement des feuilles'],
            plants: ['Vigne', 'Tomate', 'Pomme de terre'],
            treatment: 'Traitements cupriques préventifs'
          },
          {
            id: 2,
            name: 'Oïdium',
            scientificName: 'Erysiphe necator',
            description: 'Champignon formant un duvet blanc poudreux',
            symptoms: ['Duvet blanc poudreux', 'Déformation des feuilles', 'Ralentissement de croissance'],
            plants: ['Rosier', 'Vigne', 'Courgette'],
            treatment: 'Pulvérisation de soufre'
          },
          {
            id: 3,
            name: 'Botrytis',
            scientificName: 'Botrytis cinerea',
            description: 'Pourriture grise affectant fruits et légumes',
            symptoms: ['Pourriture grise', 'Moisissure duveteuse', 'Ramollissement des tissus'],
            plants: ['Fraisier', 'Tomate', 'Laitue'],
            treatment: 'Amélioration de la ventilation, fongicides'
          },
          {
            id: 4,
            name: 'Rouille',
            scientificName: 'Puccinia spp.',
            description: 'Champignon causant des pustules orangées',
            symptoms: ['Pustules orangées', 'Taches brunes', 'Jaunissement des feuilles'],
            plants: ['Rosier', 'Haricot', 'Blé'],
            treatment: 'Fongicides systémiques'
          },
          {
            id: 5,
            name: 'Alternariose',
            scientificName: 'Alternaria solani',
            description: 'Taches brunes concentriques sur feuilles',
            symptoms: ['Taches brunes concentriques', 'Défoliation précoce', 'Taches sur fruits'],
            plants: ['Tomate', 'Pomme de terre', 'Carotte'],
            treatment: 'Rotation des cultures, fongicides'
          },
          {
            id: 6,
            name: 'Fusariose',
            scientificName: 'Fusarium spp.',
            description: 'Champignon du sol causant le flétrissement',
            symptoms: ['Flétrissement', 'Jaunissement des feuilles', 'Pourriture des racines'],
            plants: ['Tomate', 'Basilic', 'Cyclamen'],
            treatment: 'Désinfection du sol, variétés résistantes'
          }
        ];

        const mockInsects = [
          {
            id: 1,
            name: 'Puceron',
            scientificName: 'Aphidoidea',
            description: 'Petits insectes suceurs de sève',
            symptoms: ['Déformation des feuilles', 'Présence de miellat', 'Ralentissement de croissance'],
            plants: ['Rosier', 'Tomate', 'Pêcher'],
            treatment: 'Pulvérisation d\'eau savonneuse, auxiliaires'
          },
          {
            id: 2,
            name: 'Cochenille',
            scientificName: 'Coccoidea',
            description: 'Insectes formant des amas cotonneux',
            symptoms: ['Amas cotonneux blancs', 'Affaiblissement de la plante', 'Miellat collant'],
            plants: ['Agrumes', 'Cactus', 'Plantes d\'intérieur'],
            treatment: 'Alcool à 70°, huile de neem'
          },
          {
            id: 3,
            name: 'Thrips',
            scientificName: 'Thysanoptera',
            description: 'Minuscules insectes causant des décolorations',
            symptoms: ['Décolorations argentées', 'Points noirs', 'Déformation des feuilles'],
            plants: ['Orchidée', 'Concombre', 'Poivron'],
            treatment: 'Pièges chromatiques, acariens prédateurs'
          },
          {
            id: 4,
            name: 'Aleurode',
            scientificName: 'Aleyrodidae',
            description: 'Mouches blanches minuscules',
            symptoms: ['Nuages de mouches blanches', 'Jaunissement des feuilles', 'Miellat'],
            plants: ['Tomate', 'Aubergine', 'Géranium'],
            treatment: 'Pièges jaunes, huile de neem'
          },
          {
            id: 5,
            name: 'Acarien rouge',
            scientificName: 'Tetranychidae',
            description: 'Araignées microscopiques tisseuses de toiles',
            symptoms: ['Toiles fines', 'Pointillés sur feuilles', 'Jaunissement'],
            plants: ['Haricot', 'Concombre', 'Rosier'],
            treatment: 'Augmentation de l\'humidité, acaricides'
          },
          {
            id: 6,
            name: 'Chenille',
            scientificName: 'Lepidoptera larvae',
            description: 'Larves de papillons défoliatrices',
            symptoms: ['Trous dans les feuilles', 'Défoliation', 'Présence d\'excréments'],
            plants: ['Chou', 'Tomate', 'Arbres fruitiers'],
            treatment: 'Ramassage manuel, Bacillus thuringiensis'
          }
        ];

        setDiseases(mockDiseases);
        setInsects(mockInsects);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpanded = (type, id) => {
    setExpandedItems(prev => ({
      ...prev,
      [`${type}-${id}`]: !prev[`${type}-${id}`]
    }));
  };

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInsects = insects.filter(insect =>
    insect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insect.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = (item, type) => {
    const isExpanded = expandedItems[`${type}-${item.id}`];
    const icon = type === 'disease' ? <Leaf size={20} color="#dc2626" /> : <Bug size={20} color="#16a34a" />;

    return (
      <div
        key={`${type}-${item.id}`}
        style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          marginBottom: '8px',
          overflow: 'hidden'
        }}
      >
        <div
          onClick={() => toggleExpanded(type, item.id)}
          style={{
            padding: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {icon}
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                {item.name}
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '14px', color: '#64748b', fontStyle: 'italic' }}>
                {item.scientificName}
              </p>
            </div>
          </div>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {isExpanded && (
          <div style={{ padding: '16px' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#475569' }}>
              {item.description}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
              <div>
                <h5 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                  Symptômes:
                </h5>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: '#64748b' }}>
                  {item.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                  Plantes affectées:
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {item.plants.map((plant, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    >
                      {plant}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <h5 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                Traitement:
              </h5>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                {item.treatment}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '16px', color: '#64748b' }}>Chargement des données...</div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      marginTop: '24px'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#1e293b',
        margin: '0 0 20px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Search size={20} />
        Référentiel des maladies et ravageurs
      </h2>

      {/* Search and Filter Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Rechercher une maladie ou un insecte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            minWidth: '150px'
          }}
        >
          <option value="all">Tout afficher</option>
          <option value="diseases">Maladies uniquement</option>
          <option value="insects">Ravageurs uniquement</option>
        </select>
      </div>

      {/* Results */}
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {(selectedCategory === 'all' || selectedCategory === 'diseases') && filteredDiseases.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#dc2626',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Leaf size={18} />
              Maladies des plantes ({filteredDiseases.length})
            </h3>
            {filteredDiseases.map(disease => renderItem(disease, 'disease'))}
          </div>
        )}

        {(selectedCategory === 'all' || selectedCategory === 'insects') && filteredInsects.length > 0 && (
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#16a34a',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Bug size={18} />
              Ravageurs ({filteredInsects.length})
            </h3>
            {filteredInsects.map(insect => renderItem(insect, 'insect'))}
          </div>
        )}

        {filteredDiseases.length === 0 && filteredInsects.length === 0 && searchTerm && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#64748b',
            fontSize: '16px'
          }}>
            Aucun résultat trouvé pour "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseInsectReference;