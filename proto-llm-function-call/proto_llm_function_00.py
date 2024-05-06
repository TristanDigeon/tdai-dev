import os
from openai import OpenAI
from flask import Flask, request, render_template, jsonify, session
import json
import time
#import markdown2
#import re
import math
import datetime
import logging
#import pprint


###############Initialisation client OPEN AI############################
# Charger les variables d'environnement à partir du fichier .env
from dotenv import load_dotenv
load_dotenv('config_llm-func.env')
#récupére la clé pour la passé aux template et tester l'état des Runs
openai_api_key = os.getenv('OPENAI_API_KEY')

#initialisation depuis OPENAI_API_KEY chargée depuis un .env
client = OpenAI(api_key=openai_api_key)


MAX_RETRIES = 3
###############Initialisation client############################


###############fonction test############################
def arrondir_a_la_centaine_superieure(nombre):
    return math.ceil(nombre / 100) * 100

def arrondir_a_la_cinq_centaine_superieure(nombre):
    return math.ceil(nombre / 500) * 500

def calcul_x(nombre_A:int=1, nombre_B:int=0):
    """ La fonction calcul indique XXXXXX"""
    
    #print(f"[TT]fonction appelée entrée[TT]" )

    nombre_X = ""
    nb_cumul_Y1 = 1
    nb_cumul_Y2 = 1

    if (nombre_A <= 19):
        if(nombre_B <= 1):
            nombre_X = "sortie A1"
        else:
            nombre_X = "sortie B1"

    if (20 <= nombre_A <= 50):
        if(nombre_B <= 1):
            nombre_X = "sortie A2"
        else:
            nombre_X = "sortie B2"

    if (51 <= nombre_A <= 100):
        if(nombre_B <= 1):
            nombre_X = "sortie A3"
        else:
            nombre_X = "sortie B3"

    if (101 <= nombre_A <= 500):

        nb_cumul_Y1 = (arrondir_a_la_centaine_superieure(nombre_A)/100)+1
        
        insert_nb_cumul_Y1 = str(nb_cumul_Y1)

        if(nombre_B <= 1):
            nombre_X = f"sortie A4, cumul Y1: {insert_nb_cumul_Y1}"
        else:
            nombre_X = f"sortie B4, cumul Y1: {insert_nb_cumul_Y1}"

    if (nombre_A > 500):

        nb_cumul_Y1 = (arrondir_a_la_centaine_superieure(nombre_A)/100)

        nb_cumul_Y2 = (arrondir_a_la_cinq_centaine_superieure(nombre_A)/500) + 1

        insert_nb_cumul_Y1 = str(int(nb_cumul_Y1))
        insert_nb_cumul_Y2 = str(int(nb_cumul_Y2))

        if(nombre_B <= 1):
            nombre_X = f"sortie A5, cumul Y2: {insert_nb_cumul_Y1}, cumul Y2: {insert_nb_cumul_Y2},"
        else:
            nombre_X = f"sortie B5, cumul Y2: {insert_nb_cumul_Y1}, cumul Y2: {insert_nb_cumul_Y2},"

    #print(f"[TT]fonction appelée sortie[TT]" )
    return(nombre_X)
###############fonction test############################

###############Gestion Chat-LLM############################
def wait_on_run(run, thread):
    """
    poke le statut du run périodiquement jusqu'a ce qu'il sorte de l'état queue/in_progress
    """
    action_required = 0
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        print(run.status)
        time.sleep(0.7)

    if(run.status == "requires_action"):
        #print("[tt]exit wait on requiers_action[tt]")        
        action_required = 1 

        arguments = retreive_json_inputs(run)

        tool_call_id = arguments[0]
        resultat_inter = calcul_x(arguments[1], arguments[2])

        submit_tool_ouputs(run, thread, tool_call_id, resultat_inter)

    return run, action_required


def start_thread(assistant):
    """
    récupére l'assistant et crée le thread
    """
    try:
        # Tentative de récuparation de l'assitant
        my_assistant = client.beta.assistants.retrieve(assistant)
    except Exception as e:
        print(f"Une erreur est survenue lors du retrieve de l'asst: {e}")

    try:
        # Tentative de création du thread
        thread = client.beta.threads.create()
    except Exception as e:
        print(f"Une erreur est survenue lors de la creation du thread: {e}")

    return my_assistant, thread


def add_message_and_run(user_input, my_assistant, thread, log_file):
    """
    ajoute un nouveau message user, relance un run et renvoie la nouvelle réponse du LLM
    """
    # Écrire l'input de l'utilisateur dans le fichier de log
    write_to_log(log_file, "User", user_input)
    
    try:
        #ajoute le message au thread
        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_input
        )            
    except Exception as e:
        print(f"Une erreur est survenue lors de l'ajout du message: {e}")

    try:
        #execute l'assistant (run the assistant)
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=my_assistant.id,        
        )
    except Exception as e:
        print(f"Une erreur est survenue lors de la création du run: {e}")

    """
    id_du_run=run.id
    print(f'id du run start : {id_du_run}') 
    """

    #attends la réponse, en retour, le run est mis à jour 
    call_function_pass_wait = wait_on_run(run, thread)   
    #print(f"[TT]runstatus post wait: {run.status}")
    print(f'call_function_pass_wait : {call_function_pass_wait[1]}')

    #quand l'assistant à former les inputs de la fonction, on lance la récupération du tool_calls dans la réponse JSON        
    if(call_function_pass_wait[1] == 1):       
        """ arguments = retreive_json_inputs(run)
        tool_call_id = arguments[0]
        resultat_inter = calcul_x(arguments[1], arguments[2])

        submit_tool_ouputs(run, thread, tool_call_id, resultat_inter) """
        wait_on_run(run, thread)

    
    ## récupére la réponse
    try:
        # récupére tous les messages ajoutés après le dernier message user
        messages = client.beta.threads.messages.list(
            thread_id=thread.id, order="asc", after=message.id
        )
    except Exception as e:
        print(f"Une erreur est survenue lors de la récuparation des messages: {e}")

    # Vérifie si la liste des messages récupérés contient des éléments
    if messages.data:

        # Accéde au premier élément de la liste
        message_retrived = messages.data[0]

        # Accéde au contenu du message
        content_retrived = message_retrived.content

        # Accéde au texte du contenu
        text_content = content_retrived[0].text

        # Accéde à la valeur du texte
        text_value = text_content.value

        # Écris la réponse de l'assistant dans le fichier de log
        write_to_log(log_file, "Assistant", text_value)

    else:
        # Si aucun message n'a été récupéré, définir une valeur par défaut ou gérer l'absence de réponse
        text_value = "Aucune réponse obtenue ou erreur dans la récupération du message."
        write_to_log(log_file, "Assistant", "Aucune réponse ou erreur")


    return text_value, run.id, thread.id, my_assistant.id


def retreive_json_inputs(run):
    ## récupére les inputs du tools_call de la réponse
    """  print("états du run avant récup args JSON:\n")
    print(run)
    print("\n") """
    try:
        tool_call = run.required_action.submit_tool_outputs.tool_calls[0]
        name = tool_call.function.name
        arguments = json.loads(tool_call.function.arguments)
        tool_call_id = tool_call.id
    except Exception as e:
            print(f"Une erreur est survenue lors de la récuparation des arguments: {e}") 

    print(f"Function Name:{name}")
    print(f"Function Arguments:{arguments}")
    
    nombre_A = arguments["nombre_A"]    
    nombre_B = arguments["nombre_B"]

    print(f"nombre_A:{nombre_A}")
    print(f"nombre_B:{nombre_B}")
    print(f"tool_call_ID:{tool_call_id}")
    #input("Appuyer sur une touche pour continuer")

    return tool_call_id, nombre_A, nombre_B 
  
    
  

def submit_tool_ouputs(run, thread, tool_call_id, resultat): 
    #renvoie la réponse à l'assistant 
    run = client.beta.threads.runs.submit_tool_outputs(
    thread_id=thread.id,
    run_id=run.id,    
    tool_outputs=[
        {
            "tool_call_id": tool_call_id,
            "output": resultat,
        },
        ]
    ) 
    print(f"submit réponse OK")
    #input("Appuyer sur une touche pour continuer")
    return


###############Gestion Chat-LLM Chess############################
def wait_on_run_2(run, thread):
    """
    poke le statut du run périodiquement jusqu'a ce qu'il sorte de l'état queue/in_progress
    """
    action_required = 0
    arguments_position ={}

    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        print(run.status)
        time.sleep(0.7)

    if(run.status == "requires_action"):
        #print("[tt]exit wait on requiers_action[tt]_CHESS")        
        action_required = 1 

        arguments_position = retreive_json_inputs_2(run)
        #print(f"argument de la pos: {arguments_position}")
        #input("position réçue dans wait 2 appuyer sur une touche")

        """ tool_call_id = arguments[0] """
        
        tool_call_id_2 =  arguments_position [0]
        retour_position = "la position a bien été affichée"        

        submit_tool_ouputs(run, thread, tool_call_id_2, retour_position)

    return run, action_required, arguments_position



def add_message_and_run_2(user_input, my_assistant, thread, log_file):
    """
    ajoute un nouveau message user, relance un run et renvoie la nouvelle réponse du LLM + la position d'échecs
    """
    # Écrire l'input de l'utilisateur dans le fichier de log
    write_to_log(log_file, "User", user_input)
    
    try:
        #ajoute le message au thread
        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_input
        )            
    except Exception as e:
        print(f"Une erreur est survenue lors de l'ajout du message: {e}")

    try:
        #execute l'assistant (run the assistant)
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=my_assistant.id,        
        )
    except Exception as e:
        print(f"Une erreur est survenue lors de la création du run: {e}")

    """ id_du_run=run.id
    print(f'id du run start : {id_du_run}') """

    #attends la réponse, en retour, le run est mis à jour 
    call_function_pass_wait = wait_on_run_2(run, thread)   
    run_acc = call_function_pass_wait[0]
    action_requierd_acc = call_function_pass_wait[1]
    position_acc = call_function_pass_wait[2]
    #print(f"[TT]runstatus post wait: {run.status}")
    print(f'call_function_pass_wait : {action_requierd_acc}')

    #quand l'assistant à former les inputs de la fonction, on lance la récupération du tool_calls dans la réponse JSON        
    if(action_requierd_acc == 1):               
        wait_on_run_2(run, thread)

    
    ## récupére la réponse
    try:
        # récupére tous les messages ajoutés après le dernier message user
        messages = client.beta.threads.messages.list(
            thread_id=thread.id, order="asc", after=message.id
        )
    except Exception as e:
        print(f"Une erreur est survenue lors de la récuparation des messages: {e}")

    # Vérifie si la liste des messages récupérés contient des éléments
    if messages.data:

        # Accéde au premier élément de la liste
        message_retrived = messages.data[0]

        # Accéde au contenu du message
        content_retrived = message_retrived.content

        # Accéde au texte du contenu
        text_content = content_retrived[0].text

        # Accéde à la valeur du texte
        text_value = text_content.value

        # Écris la réponse de l'assistant dans le fichier de log
        write_to_log(log_file, "Assistant", text_value)

    else:
        # Si aucun message n'a été récupéré, définir une valeur par défaut ou gérer l'absence de réponse
        text_value = "Aucune réponse obtenue ou erreur dans la récupération du message."
        write_to_log(log_file, "Assistant", "Aucune réponse ou erreur")


    return text_value, run.id, thread.id, my_assistant.id, position_acc


def retreive_json_inputs_2(run):
    ## récupére les inputs du tools_call de la réponse
    """  print("états du run avant récup args JSON:\n")
    print(run)
    print("\n") """
    try:
        tool_call_2 = run.required_action.submit_tool_outputs.tool_calls[0]
        name_2 = tool_call_2.function.name
        arguments_2 = json.loads(tool_call_2.function.arguments)
        tool_call_id_2 = tool_call_2.id
    except Exception as e:
            print(f"Une erreur est survenue lors de la récuparation des arguments (chess): {e}") 

    print(f"Function Name:{name_2}")
    print(f"Function Arguments:{arguments_2}")
    print(f"tool_call_ID:{tool_call_id_2}")
    if arguments_2["position"]:
        position = arguments_2["position"]
        print(f"postion okok : {position}")
    else:
        position = {'g1': 'wK', 'f1': 'bQ'}
        print(f"postion DOWN!!!")
    #input("Appuyer sur une touche pour continuer")

    return tool_call_id_2, position




###############Gestion Chat-LLM Chess############################




###############Gestion de l'historique global############################
def write_to_log(file_path, role, message):
    try:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(file_path, "a", encoding="utf-8") as file:
            file.write(f"{timestamp} - {role}: {message}\n")
    except IOError as e:
        # Enregistre l'erreur dans un fichier de log d'erreur
        logging.error(f"Erreur lors de l'écriture dans le fichier de log : {e}")
    except Exception as e:
        # Gestion des autres exceptions potentielles
        logging.error(f"Erreur inattendue lors de l'écriture dans le fichier de log : {e}")

###############Gestion de l'historique global############################



################Interface DEMO LLM-function##################################

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY')

# Variables globales
global_log_file = None
global_thread_infos = None
global_thread_infos_2 = None

@app.route("/")
def index():
    global global_thread_infos, global_log_file
    global global_thread_infos, global_thread_infos_2, global_log_file


    #assistant = os.getenv('ASST_GTP4')
    assistant = os.getenv('ASST_GTP3')

    #CHESS
    assistant_2 = os.getenv('ASST_CHESS_GTP4')
    #assistant_2 = os.getenv('ASST_CHESS_GTP3')
    

    global_log_file = "historique.txt"       
    
    # Configuration du logger pour enregistrer les erreurs
    logging.basicConfig(filename='error_log.txt', level=logging.ERROR)

    #récupére l'assistant et crée un nouveau thread 
    global_thread_infos=start_thread(assistant)
    global_thread_infos_2=start_thread(assistant_2)

   

    return render_template('chat.html')
##ok##


@app.route("/get", methods=["GET", "POST"])
def chat():
    global global_thread_infos, global_log_file
    user_input = request.form["msg"]       

    current_chat_state=add_message_and_run(user_input, global_thread_infos[0], global_thread_infos[1], global_log_file)

    reponse_llm=current_chat_state[0]
    run_id=current_chat_state[1]
    thread_id=current_chat_state[2]
    assistant_id=current_chat_state[3]


    return  reponse_llm

###############fonctions CHESS############################
@app.route('/get_chess_position', methods=["GET", "POST"])
def chat_2():
    global global_thread_infos_2, global_log_file
    user_input_2 = request.form["msg_2"]    
    """ print(f"message input chess: {user_input_2}") """
    #assistant
    """ print(f"message input chess: {global_thread_infos_2[0]}") """
    #thread
    """ print(f"message input chess: {global_thread_infos_2[1]}") """



    current_chat_state_2=add_message_and_run_2(user_input_2, global_thread_infos_2[0], global_thread_infos_2[1], global_log_file)

    reponse_llm_2=current_chat_state_2[0]
    run_id_2=current_chat_state_2[1]
    thread_id_2=current_chat_state_2[2]
    assistant_id_2=current_chat_state_2[3]
    chess_position=current_chat_state_2[4]

    if chess_position:
        print(f'renvoi final position: {chess_position[1]}')
        return jsonify({"type": "chess", "data": chess_position[1]})
    else:
        print(f'renvoi final message llm')
        return jsonify({"type": "message", "data": reponse_llm_2})


###############fonctions CHESS############################
  

if __name__ == '__main__':
    
    #flask écoute toutes les interfaces -> à activer pour accès via web
    """ app.run(host='0.0.0.0', port=8080) """
    app.run()

################Interface DEMO LLM-function##################################