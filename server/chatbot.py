import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from responses import response_dict

# Load the dataset
df = pd.read_csv('complaints_data.csv')  #Load the complaints dataset from a CSV file

# Preprocessing
X = df['complaintTitle'] + ' ' + df['complaintDescription'] # Combine the title and description of the complaints into a single feature
y = df['complaintCategory'] # Target variable representing the category of each complaint

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)  #Split the data into training and testing sets (80% train, 20% test)

# Vectorize text data using TF-IDF
tfidf_vectorizer = TfidfVectorizer(max_features=1000) # Initialize the TF-IDF vectorizer with a maximum of 1000 features
X_train_tfidf = tfidf_vectorizer.fit_transform(X_train)  # Fit and transform the training data
X_test_tfidf = tfidf_vectorizer.transform(X_test)  # Transform the test data using the fitted vectorizer

# Train a Logistic Regression model
classifier = LogisticRegression(max_iter=1000)  #Initialize a Logistic Regression model with a maximum of 1000 iterations
classifier.fit(X_train_tfidf, y_train)  # Train the model on the training data

# Evaluate the model
y_pred = classifier.predict(X_test_tfidf) # Predict the categories for the test data
accuracy = accuracy_score(y_test, y_pred)
# print(f'Accuracy: {accuracy}')
# print(classification_report(y_test, y_pred))

def classify_complaint(complaint_text):
    # Vectorize the complaint text
    complaint_tfidf = tfidf_vectorizer.transform([complaint_text]) # Transform the complaint text using the fitted TF-IDF vectorizer

    # Predict category
    predicted_category = classifier.predict(complaint_tfidf)[0] # Predict the category of the complaint text

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
