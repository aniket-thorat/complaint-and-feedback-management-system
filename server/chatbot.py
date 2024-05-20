import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# Load the dataset
df = pd.read_csv('complaints_data.csv')

# Preprocessing
X = df['complaintTitle'] + ' ' + df['complaintDescription']
y = df['complaintCategory']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Vectorize text data using TF-IDF
tfidf_vectorizer = TfidfVectorizer(max_features=1000)
X_train_tfidf = tfidf_vectorizer.fit_transform(X_train)
X_test_tfidf = tfidf_vectorizer.transform(X_test)

# Train a Logistic Regression model
classifier = LogisticRegression(max_iter=1000)
classifier.fit(X_train_tfidf, y_train)

# Evaluate the model
y_pred = classifier.predict(X_test_tfidf)
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy}')
print(classification_report(y_test, y_pred))

# Dummy responses for different categories
response_dict = {
    'Billing Issues': "We apologize for any billing issues you've encountered. Please contact our customer service team, and they'll assist you in resolving your billing concerns promptly. Your satisfaction is our priority, and we're committed to ensuring a seamless experience for you. Thank you for bringing this to our attention, and we appreciate your patience as we work to make things right for you.",
    'Delivery Delays': "We apologize for delivery delays and assure you that our team is actively resolving the issue. Your satisfaction is crucial, and we're working diligently to ensure prompt and improved deliveries. Thank you for your patience and support. If you need further assistance or have concerns, please contact us.",
    'Product Quality': 'We prioritize product quality. Kindly raise a complaint regarding your concern, and our team will promptly address it. Expect our executive to contact you soon for assistance. Thank you for your feedback and for helping us maintain our commitment to quality service.',
    'Customer Service': "Our dedicated customer service team is committed to addressing your concerns promptly. Expect a member of our team to reach out to you shortly to discuss and resolve any issues you may have. Your satisfaction is important to us, and we appreciate your patience as we work to ensure a positive experience for you. Thank you for choosing us and for bringing your concerns to our attention.",
	'Advertising Concerns':'To ensure a seamless experience with our ads services, please email us at maccros@gmail.com with your detailed concerns. Our team will prioritize addressing your issues promptly. Rest assured, we are committed to resolving any problems you may encounter. Thank you for choosing our services, and we look forward to assisting you soon.',
    'Ecommerce Platform Errors': 'Ok ok ok',
    'other': 'Thank you for reaching us out. Currently I dont have enough data to answer your query please raised a complaint for your query.',
	'greeting': 'Hello! How can I assist you today?',
    'thanks': 'You are welcome! I am happy to help.'
}

def classify_complaint(complaint_text):
    # Vectorize the complaint text
    complaint_tfidf = tfidf_vectorizer.transform([complaint_text])

    # Predict category
    predicted_category = classifier.predict(complaint_tfidf)[0]

    return predicted_category

def get_bot_response(user_input):
    # Check if user input is a greeting or thanks
    greetings = ['hi', 'hello', 'hola', 'helo', 'hlo', 'hii']
    thanks = ['thank you', 'thanks', 'ok', 'okay', 'ok thanks', 'ok thank you', 'thank']
    if any(greeting in user_input.lower() for greeting in greetings):
        return response_dict['greeting']
    elif any(thank in user_input.lower() for thank in thanks):
        return response_dict['thanks']
    else:
        # Predict category for non-greeting inputs
        predicted_category = classify_complaint(user_input)
        return response_dict.get(predicted_category, response_dict['other'])

# Example usage
if __name__ == "__main__":
	while True:
		complaint_text = input("")
		response = get_bot_response(complaint_text)
		print(response)
