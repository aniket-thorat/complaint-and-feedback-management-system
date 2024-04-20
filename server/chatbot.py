import os
import json
import google.generativeai as palm
from summa import summarizer
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet

# Retrieve the API key from the environment variables
api_key = "AIzaSyDUpUT9XGiMjYD5w2YhhqH_K9cgZtOhY2M"  # Replace with your actual API key

# Configure palm
palm.configure(api_key=api_key)

# Choose a model, there is 1 model available
models = [m for m in palm.list_models() if 'generateText' in m.supported_generation_methods]
model = models[0].name

# Custom prompt to encourage longer responses
custom_prompt = f"""I am Maccros Media LLP's AI assistant specializing in advertising, e-commerce, and business solutions. If you greet me with 'hi,' 'hello,' or 'hey,' I'll greet you back. Feel free to ask me anything related to these areas. If your query goes beyond my expertise, I'll inform you politely. 
Here are some examples of how I can help you:
  * Advertising: Understand campaign goals, target audiences, bidding strategies, etc.
  * E-commerce: Optimize product listings, improve customer experience, etc.
  * Business Solutions: Explore marketing automation tools, data analytics solutions, etc.
**Please note:** I am still under development, and my responses may not always be perfect. 
"""

# Cache to store the generated responses for the current topic
response_cache = {}

# Cache to store the previous question for context
topic_1_cache = {}

# Chat history to store all questions and answers
chat_history = {}

# File paths for chat history and topic_1_cache
chat_history_file = "chat_history.json"
topic_1_cache_file = "topic_1_cache.json"

def load_chat_history(file_path):
    """
    Load chat history from a JSON file.

    Args:
        file_path (str): The file path of the JSON file.

    Returns:
        dict: The loaded chat history.
    """
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            return json.load(file)
    else:
        return {}

def save_chat_history(chat_history, file_path):
    """
    Save chat history to a JSON file.

    Args:
        chat_history (dict): The chat history to be saved.
        file_path (str): The file path of the JSON file.
    """
    with open(file_path, "w") as file:
        json.dump(chat_history, file)

def load_topic_1_cache(file_path):
    """
    Load the topic_1_cache from a JSON file.

    Args:
        file_path (str): The file path of the JSON file.

    Returns:
        dict: The loaded topic_1_cache.
    """
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            return json.load(file)
    else:
        return {}

def save_topic_1_cache(topic_1_cache, file_path):
    """
    Save the topic_1_cache to a JSON file.

    Args:
        topic_1_cache (dict): The topic_1_cache to be saved.
        file_path (str): The file path of the JSON file.
    """
    with open(file_path, "w") as file:
        json.dump(topic_1_cache, file)

def delete_topic_1_cache(file_path):
    """
    Delete the data in the topic_1_cache file.

    Args:
        file_path (str): The file path of the JSON file.
    """
    if os.path.exists(file_path):
        os.remove(file_path)

def generate_brief(text):
    """
    Generate a brief summary of the given text.

    Args:
        text (str): The text to be summarized.

    Returns:
        str: The generated summary.
    """
    return summarizer.summarize(text, ratio=0.2)  # Adjust the ratio as needed

def generate_pdf_report(chat_history, pdf_filename):
    """
    Generate a PDF report based on the chat history.

    Args:
        chat_history (dict): The chat history.
        pdf_filename (str): The file name of the PDF report.
    """
    doc = SimpleDocTemplate(pdf_filename, pagesize=letter)

    # Create a list to hold the content of the PDF
    content = []

    # Create a style for the table
    styles = getSampleStyleSheet()
    style = styles["Normal"]

    # Add a title for the report
    content.append(Paragraph("Summary_Report", styles["Title"]))

    # Add the chat history as paragraphs
    for topic, chat in chat_history.items():
        if chat and "answer" in chat and chat["answer"]:
            content.append(Paragraph(f"Topic: {topic}", styles["Heading2"]))
            content.append(Paragraph(generate_brief(chat["answer"]), style))

    # Build the PDF document
    doc.build(content)

def chatbot():
    """
    Main chatbot function.
    """
    chat_history = load_chat_history(chat_history_file)
    topic_1_cache = load_topic_1_cache(topic_1_cache_file)

    while True:
        # Get user input for the specific topic
        topic = input("")

        if topic.lower() == 'exit':
            break

        # Check if the response is already in the cache
        if topic in response_cache:
            print(response_cache[topic])
            previous_question = topic_1_cache.get(topic, "")  # Get the previous question for context
            continue

        # Construct the API call prompt using the current topic and the previous question for context
        api_call_prompt = f"{custom_prompt} {topic}"
        if topic in topic_1_cache:
            previous_question = topic_1_cache[topic]
            api_call_prompt += f" {previous_question}"

        # Otherwise, generate the response and cache it
        response = palm.generate_text(
            prompt=api_call_prompt,
            model=model,
            temperature=0.95,
            max_output_tokens=2048,
            top_p=0.9,
            top_k=30,
            stop_sequences=["end of explanation"]
        )

        response_cache[topic] = response.result
        topic_1_cache[topic] = topic  # Store the current topic in topic_1_cache

        # Add the question and answer to the chat history
        chat_history[topic] = {"question": topic, "answer": response.result}

        print(response.result)

    # Save the chat history to a JSON file
    save_chat_history(chat_history, chat_history_file)
    save_topic_1_cache(topic_1_cache, topic_1_cache_file)

    # Generate the PDF report
    pdf_filename = "chat_history_report.pdf"
    generate_pdf_report(chat_history, pdf_filename)
    print(f"\nChat history saved to {chat_history_file}")
    print(f"Chat history report saved to {pdf_filename}")

    # Delete data in the topic_1_cache file
    delete_topic_1_cache(topic_1_cache_file)

# Run the chatbot
if __name__ == "__main__":
    chatbot()