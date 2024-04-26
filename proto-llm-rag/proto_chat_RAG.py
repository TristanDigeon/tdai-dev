import os
import gradio as gr
from openai import OpenAI
#from openai import AsyncOpenAI
import pinecone
import json
import time

from dotenv import load_dotenv

# Charger les variables d'environnement à partir du fichier .env
load_dotenv('config_chat.env')

# get api key from app.pinecone.io
api_key = os.environ.get('PINECONE_API_KEY')
# find your environment next to the api key in pinecone console
env = os.environ.get('PINECONE_ENVIRONMENT') 

pinecone.init(
    api_key=api_key,
    environment=env
)

GPT_MODEL_3T = "gpt-3.5-turbo"
GPT_MODEL_4 = "gpt-4"
GPT_MODEL_4T = "gpt-4-1106-preview"
EMBEDDING_MODEL = "text-embedding-ada-002"
GPT_MODEL = "gpt-3.5-turbo"
#GPT_MODEL = "gpt-4"
#GPT_MODEL = "gpt-4-1106-preview"

#Step 0: initialiser le client
client = OpenAI()
#client = AsyncOpenAI() #ne pas utliser


#connection à l'index
index_name = "protorag"
index = pinecone.Index(index_name)

#new sdk 1.2
    #client = OpenAI()    
    #completion = client.chat.completions.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": "Hello world"}])

####Embedings###
def emb_txt(entree):    
    """
    génére les embedings
    """

    embed = client.embeddings.create(
        input=entree,
        model=EMBEDDING_MODEL
    )

    #print(embed.data[0].embedding)
    return embed.data[0].embedding

####RAG###
def retrive(nbtop, emb):

  resultats = index.query(
  vector=emb,
  top_k=nbtop,
  include_values=False
  )
  
  return  resultats

def query_retrive(nbtop, question):

    qembeding = emb_txt(question)

    top_rank = retrive(nbtop,qembeding)

    #formatage pour ne garder que les ID et les scores
    formatted_data = []

    # Itérer sur chaque élément dans la liste 'matches'
    for match in top_rank['matches']:
        # Extraire l'ID et le score, et les formater comme souhaité
        formatted_entry = f"Score: {match['score']:.3f}\treference {match['id']}"
        formatted_data.append(formatted_entry)

    # Joindre toutes les entrées formatées en une seule chaîne de caractères, séparées par des sauts de ligne
    final_output = "\n".join(formatted_data)
    return final_output

def query_retrive_ID(nbtop, question):

    qembeding = emb_txt(question)
    top_rank = retrive(nbtop,qembeding)

    #formatage pour ne garder que les ID et les scores
    formatted_data = []

    # Itérer sur chaque élément dans la liste 'matches'
    for match in top_rank['matches']:
        id = match['id']
        #score = match['score']

        # Charger le fichier JSON correspondant
        try:
            with open(f'docs/{id}.json', 'r', encoding='utf-8') as json_file:
                json_data = json.load(json_file)
                # Supposons que le texte est stocké sous la clé 'text'
                text_content = json_data.get('text', 'Texte non trouvé')
        except FileNotFoundError:
            text_content = 'Fichier non trouvé'


        # Extraire l'ID et le score, et les formater comme souhaité
        #formatted_entry = f"Score: {score:.3f}\treference {id}\tTexte: {text_content}"
        formatted_entry = f"reference {id}\tcontenu de l'reference : {text_content}"
        formatted_data.append(formatted_entry)

    # Joindre toutes les entrées formatées en une seule chaîne de caractères, séparées par des sauts de ligne
    final_output = "\n".join(formatted_data)
    return final_output


def choix_reference(reference):    
    """
    affecte le contenus des references
    """

    T1= """
    XXXXXXXXXXXXXXXXXXXXXXXXX
    """
    T2= """
    XXXXXXXXXXXXXXXXXXXXXXXXX
    """
    T3= """
    XXXXXXXXXXXXXXXXXXXXXXXXX
    """
    T4= """
    XXXXXXXXXXXXXXXXXXXXXXXXX
    """
    T5= """
    XXXXXXXXXXXXXXXXXXXXXXXXX
    """
    T6= """
    XXXXXXXXXXXXXXXXXXXXXXXXX
    """
    T7= """
    XXXXXXXXXXXXXXXXXXXXXXXXX
    """
    T8= """
    XXXXXXXXXXXXXXXXXXXXXXXXX
    """
    T9= """
    XXXXXXXXXXXXXXXXXXXXXXXXX
    """
    T10= """
    XXXXXXXXXXXXXXXXXXXXXXXXX
    """

    
    contenuREF = "aucun reference choisi"

    if reference == 'T1':
        contenuREF = T1
    if reference == 'T2':
        contenuREF = T2
    if reference == 'T3':
        contenuREF = T3
    if reference == 'T4':
        contenuREF = T4
    if reference == 'T5':
        contenuREF = T5
    if reference == 'T6':
        contenuREF = T6
    if reference == 'T7':
        contenuREF = T7
    if reference == 'T8':
        contenuREF = T8
    if reference == 'T9':
        contenuREF = T9
    if reference == 'T10':
        contenuREF = T10    

    return contenuREF



####Chat###
def reponseChat(reference, questionREF, temperature):        
    """
    génére la réponse du chat, mode pyhton direct (traduction en Langchain à faire)
    """

    contenuRef = choix_reference(reference)

    query = f"""
    Utilisez le texte ci-dessous pour répondre à la question suivante. Si la réponse ne peut pas être trouvée, écrivez "Je ne sais pas."

    Texte :
    \"\"\"
    {contenuRef}
    \"\"\"

    Question : {questionREF} """
    

    response =  client.chat.completions.create(
        model=GPT_MODEL,
        messages=[
            {'role': 'system','content': 'Vous répondez aux questions.'},
            {'role': 'user','content': query},
        ],
        temperature=temperature,
        )

    # Obtenir la réponse du chatbot (sdk 1.2)
    #print(response.choices[0].message)    
    reponsedef = (response.choices[0].message.content)

    # Écrire la question et la réponse dans un fichier texte
    with open('historique_echanges.txt', 'a', encoding='utf-8') as file:
        file.write(f"Question : {questionREF}\nRéponse : {reponsedef}\n\n")

    return reponsedef


def reponseChatparam(reference, questionREF, temperature, model, instruction, prompt):        
    """
    génére la réponse du chat et permet de modifier model / insruction / prompt
    """

    sel_model = model

    contenuRef = choix_reference(reference)

    query = f"""
    {prompt}

    Texte :
    \"\"\"
    {contenuRef}
    \"\"\"

    Question : {questionREF} """
    

    response = client.chat.completions.create(
        model=sel_model,
        messages=[
            {'role': 'system','content': instruction},
            {'role': 'user','content': query},
        ],
        temperature=temperature,
        )

    # Obtenir la réponse du chatbot (sdk 1.2)
    #print(response.choices[0].message)    
    reponsedef = (response.choices[0].message.content)

    # Écrire la question et la réponse dans un fichier texte
    with open('historique_echanges.txt', 'a', encoding='utf-8') as file:
        file.write(f"Question : {questionREF}\nRéponse : {reponsedef}\n\n")

    return reponsedef

def reponseChat_chatmode(reference, conversation, questionREF, temperature):        
    """
    génére la réponse du chat en tenant compte de l'hitorique de la conversation
    """

    contenuRef = reference

    query = f"""
    Nous avons eu la conversation suivante : {conversation} 

    En tenant compte de notre conversation, utilisez les références ci-dessous pour répondre à la question suivante. Si la réponse ne peut pas être trouvée, écrivez "Je ne sais pas."

    Références :
    \"\"\"
    {contenuRef}
    \"\"\"

    Question : {questionREF} """
    

    response = client.chat.completions.create(
        model=GPT_MODEL,
        messages=[
            {'role': 'system','content': 'Vous répondez aux questions.'},
            {'role': 'user','content': query},
        ],
        temperature=temperature,
        )

    # Obtenir la réponse du chatbot (sdk 1.2)
    #print(response.choices[0].message)    
    reponsedef = (response.choices[0].message.content)

    # Écrire la question et la réponse dans un fichier texte
    with open('historique_echanges.txt', 'a', encoding='utf-8') as file:
        file.write(f"Question : {questionREF}\nRéponse : {reponsedef}\n\n")

    return reponsedef


def concat_prompt_chatbot(history):

    # Construire l'historique de la conversation
    conversation = ""
    for pair in history:
        conversation += f"Utilisateur: {pair[0]}\nChatbot: {pair[1]}\n"
    #conversation += f"Utilisateur: {message}\n"

    return conversation


####chatbot####
def chat_rag(message, history):

    #renvoi la conversation
    conversation = concat_prompt_chatbot(history)

    
    #renvoie les references pour le contexte
    kargs = 2
    references = query_retrive_ID(kargs,message)

    temperature = 0
    reponse_final = reponseChat_chatmode(references, conversation, message, temperature)
       
    return reponse_final


################TRUE CHATBOTS##############

""" def show_json(obj):
    run(json.loads(obj.model_dump_json())) """

def wait_on_run(run, thread):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.5)
    return run

def reponseChat(question):

    #1 récupérer l'assistant
    my_assistant = client.beta.assistants.retrieve("asst_XXXXXXXXXXXXXXX")
    
    #2 créer la conversation
    thread = client.beta.threads.create()

    #Step 3: Add a Message to a Thread
    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=question
    )

    #step 4: Run the assistant
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=my_assistant.id,
        #instructions="merci de répondre à cette question"
    )

    wait_on_run(run, thread)
   
    #5 retrive message 
    # Retrieve all the messages added after our last user message
    messages = client.beta.threads.messages.list(
        thread_id=thread.id, order="asc", after=message.id
    )

    # Accéder au premier élément de la liste des données (si vous êtes sûr qu'il n'y a qu'un seul message)
    messagett = messages.data[0]

    # Accéder au contenu du message
    contenttt = messagett.content

    # Accéder au texte du contenu (si vous êtes sûr qu'il s'agit d'un contenu textuel)
    text_content = contenttt[0].text

    # Accéder à la valeur du texte
    text_value = text_content.value

    return text_value
    
    #return messages 



################interface GRADIO################
# Définir les options de la liste déroulante
options = ["aucun","T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10",]

opt_model = ["gpt-3.5-turbo", "gpt-4", "gpt-4-1106-preview"]

# Créer le composant d'entrée Dropdown
#dropdown = gr.Dropdown(choices=options, label="Sélectionnez l'reference de référence :")
#inner = gr.Textbox(lines=4, label='Posez votre question :')
#slide = gr.Slider(0,1, step=0.1, label="Temperature (créativité)")

default_prompt = 'Utilisez le texte ci-dessous pour répondre à la question suivante. Si la réponse ne peut pas être trouvée, écrivez "Je ne sais pas."'
default_instructions = 'Vous répondez aux questions.'


with gr.Blocks(theme=gr.themes.Soft(font=("Verdana", "sans-serif", "system-ui")), title="Demo LLM") as interface:
    gr.Markdown("**Développement LLM**\n")
    

    with gr.Tab("Demo chabot avec RAG"):   
        chat_interface = gr.ChatInterface(fn=chat_rag, title="Echangez avec le contenu des références :")
       
    with gr.Tab("Demo température"):
        with gr.Row():
            with gr.Column(scale=1):
                dropdown_param = gr.Dropdown(choices=options, label="Sélectionnez l'reference de référence :")
                slide_param = gr.Slider(0,1, step=0.1, label="Température", info="ajustement de la liberté du LLM : 0 = factuel, 1 = créatif")
            with gr.Column(scale=2):
                inner_param = gr.Textbox(lines=5, label='Posez votre question :')
        
        text_button_param = gr.Button("Envoyer")
        output_param = gr.Textbox(label="Réponse :")

    with gr.Tab("Demo instructions"):
        with gr.Row():
            with gr.Column(scale=1):
                dropdown_inst = gr.Dropdown(choices=options, label="Sélectionnez la référence :")
                slide_inst = gr.Slider(0,1, step=0.1, label="Température")
                dropdown_inst_model = gr.Dropdown(choices=opt_model, label="Sélectionnez le LLM :")
            with gr.Column(scale=2):
                inner_instructions_inst = gr.Textbox(lines=1, value=default_instructions, label='Instructions du model :', info='comportement attendu du LLM')
                inner_prompt_inst = gr.Textbox(lines=2, value=default_prompt, label="Prompt du model :", info='encapsule la question pour composer la réponse')
                inner_inst = gr.Textbox(lines=2, label='Posez votre question :')                
        text_button_inst = gr.Button("Envoyer")
        output_inst = gr.Textbox(label="Réponse :")
    
    with gr.Tab("Demo embedings"):          
        inner_emb = gr.Textbox(lines=2, label='Texte :', info='transormation en embeding, max = 8192 tokens') 
        text_button_emb = gr.Button("Envoyer")
        output_emb = gr.Textbox(lines=50,label="Embeding généré :", info='model ada-002, 1536 dimensions')

    with gr.Tab("Demo retrival"):   
        with gr.Row():
            with gr.Column(scale=2):
                inner_ret = gr.Textbox(lines=5, label='Posez votre question :')
            with gr.Column(scale=1):       
                inner_top_ret = gr.Number(value=5, label='nombre de retours :')
        text_button_ret = gr.Button("Envoyer")
        output_ret = gr.Textbox(lines=10,label="Réf. :", info='classement des références en relation de proximité avec la question')

    
    
    
    text_button_param.click(reponseChat, inputs=[dropdown_param, inner_param, slide_param], outputs=output_param)
    text_button_inst.click(reponseChatparam, inputs=[dropdown_inst, inner_inst, slide_inst, dropdown_inst_model,inner_instructions_inst,inner_prompt_inst ], outputs=output_inst)
    text_button_emb.click(emb_txt, inputs=inner_emb, outputs=output_emb)
    text_button_ret.click(query_retrive, inputs=[inner_top_ret, inner_ret], outputs=output_ret)
  





