import os

from dotenv import load_dotenv
load_dotenv('config_llm-func.env')
#récupére la clé pour la passer aux template et tester l'état des Runs
asst_GTP4 = os.getenv('ASST_GTP4')
asst_GTP3 = os.getenv('ASST_GTP3')

print(f'{asst_GTP4 } et {asst_GTP4 }')

