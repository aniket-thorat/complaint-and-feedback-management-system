import pandas as pd
import random

# Define categories and corresponding complaints with titles and descriptions
categories = {
    'billing': [
        {'title': 'Incorrect billing amount', 'description': 'I was charged incorrectly for a service that I did not use.'},
        {'title': 'Payment not processed', 'description': 'My payment for an order was not processed successfully.'},
        {'title': 'Double charged for a service', 'description': 'I noticed that I have been double charged for the same service.'},
        {'title': 'Late billing statement', 'description': 'I received my billing statement late, causing confusion.'},
        {'title': 'Refund not received', 'description': 'I have not received my refund for a canceled service.'},
        {'title': 'Subscription renewal issue', 'description': 'My subscription was renewed without my authorization.'},
        {'title': 'Incorrect tax calculation', 'description': 'The tax amount on my bill seems to be calculated incorrectly.'},
        {'title': 'Billing for a canceled service', 'description': 'I am still being billed for a service that I have canceled.'},
        {'title': 'Billing discrepancy', 'description': 'There is a discrepancy in the billing amount on my invoice.'},
    ],
    'delivery': [
        {'title': 'Late delivery of products', 'description': 'My order was delivered much later than the estimated delivery date.'},
        {'title': 'Missing items in delivery', 'description': 'Some items are missing from the delivery package.'},
        {'title': 'Damaged products received', 'description': 'I received damaged products in my delivery.'},
        {'title': 'Incorrect delivery address', 'description': 'The delivery was made to the wrong address.'},
        {'title': 'Delayed shipping notification', 'description': 'I did not receive a notification about the delay in shipping.'},
        {'title': 'Incomplete delivery', 'description': 'I received only part of my order in the delivery.'},
        {'title': 'Delivery package tampered', 'description': 'The delivery package seemed to be tampered with upon receipt.'},
        {'title': 'Wrong item delivered', 'description': 'I received a different item than what I ordered.'},
        {'title': 'Delivery not attempted', 'description': 'No attempt was made to deliver the package to my address.'},
    ],
    'product_quality': [
        {'title': 'Poor quality of products received', 'description': 'The products I received are of poor quality and not as described.'},
        {'title': 'Wrong product specifications', 'description': 'The specifications mentioned for the product do not match what I received.'},
        {'title': 'Defective items', 'description': 'Some of the items I received are defective and unusable.'},
        {'title': 'Product damaged in transit', 'description': 'The products were damaged during shipping and handling.'},
        {'title': 'Expired products', 'description': 'I received products that are past their expiration date.'},
        {'title': 'Product missing components', 'description': 'The product is missing some essential components.'},
        {'title': 'Product not as advertised', 'description': 'The product received does not match the description and photos online.'},
        {'title': 'Inconsistent product quality', 'description': 'The quality of products varies significantly across different orders.'},
        {'title': 'Product packaging damaged', 'description': 'The packaging of the products was damaged upon delivery.'},
    ],
    'customer_service': [
        {'title': 'Rude customer service representative', 'description': 'I had a negative experience with a rude customer service representative.'},
        {'title': 'Long wait times on customer support', 'description': 'I had to wait for a long time on hold to reach customer support.'},
        {'title': 'Unresolved issues', 'description': 'My issues were not resolved despite multiple attempts to contact customer service.'},
        {'title': 'Ineffective communication', 'description': 'There was a lack of communication regarding the status of my complaint.'},
        {'title': 'Lack of follow-up', 'description': 'There was no follow-up from customer service after my initial complaint.'},
        {'title': 'Incorrect information provided', 'description': 'I received incorrect information from customer service representatives.'},
        {'title': 'Escalation of complaint', 'description': 'I had to escalate my complaint multiple times to get a response.'},
        {'title': 'Unhelpful responses', 'description': 'The responses from customer service were unhelpful and generic.'},
        {'title': 'Difficulties in reaching support', 'description': 'I faced difficulties in reaching customer support through the provided channels.'},
    ],
    'website_issues': [
        {'title': 'Website crashes frequently', 'description': 'The website crashes frequently when I try to access certain pages.'},
        {'title': 'Login issues', 'description': 'I am unable to log in to my account on the website.'},
        {'title': 'Unable to place orders', 'description': 'I am unable to place orders on the website due to technical issues.'},
        {'title': 'Slow website performance', 'description': 'The website is very slow and unresponsive during peak hours.'},
        {'title': 'Broken links on the website', 'description': 'There are broken links and errors on various pages of the website.'},
        {'title': 'Incorrect pricing on the website', 'description': 'The prices displayed on the website do not match the actual checkout prices.'},
        {'title': 'Website design issues', 'description': 'There are design issues and inconsistencies across different pages of the website.'},
        {'title': 'Payment gateway errors', 'description': 'I encountered errors when trying to complete a payment on the website.'},
        {'title': 'Website not mobile-friendly', 'description': 'The website is not optimized for mobile devices and is difficult to navigate.'},
    ],
    'advertising': [
        {'title': 'Ineffective advertising campaigns', 'description': 'I found the advertising campaigns to be ineffective in reaching the target audience.'},
        {'title': 'Incorrect ad placements', 'description': 'The ads were placed on irrelevant platforms with low engagement.'},
        {'title': 'Low click-through rates', 'description': 'The ads had low click-through rates and did not generate much traffic.'},
        {'title': 'Misleading advertisements', 'description': 'The advertisements were misleading and did not accurately represent the products.'},
        {'title': 'Advertising budget allocation', 'description': 'There were issues with how the advertising budget was allocated and managed.'},
        {'title': 'Advertising strategy feedback', 'description': 'I have feedback and suggestions for improving the advertising strategy.'},
        {'title': 'Inconsistent branding in ads', 'description': 'There are inconsistencies in branding across different advertising materials.'},
        {'title': 'Ad performance tracking', 'description': 'I would like better tracking and analysis of ad performance metrics.'},
        {'title': 'Advertising ROI concerns', 'description': 'I have concerns about the return on investment from advertising efforts.'},
    ],
    'ecommerce_platform': [
        {'title': 'Technical issues on the ecommerce platform', 'description': 'I encountered technical issues while using the ecommerce platform.'},
        {'title': 'Difficulty in product search', 'description': 'It is difficult to find specific products using the search function on the platform.'},
        {'title': 'Payment gateway problems', 'description': 'I experienced issues with completing payments through the platform.'},
        {'title': 'Slow checkout process', 'description': 'The checkout process on the platform is slow and cumbersome.'},
        {'title': 'Missing product information', 'description': 'There is missing or incomplete information about products on the platform.'},
        {'title': 'User interface feedback', 'description': 'I have feedback on the user interface and navigation of the platform.'},
        {'title': 'Product listing errors', 'description': 'There are errors and inconsistencies in the product listings on the platform.'},
        {'title': 'Ecommerce platform downtime', 'description': 'The platform experiences frequent downtime and maintenance issues.'},
        {'title': 'Order tracking difficulties', 'description': 'I faced difficulties in tracking my orders through the platform.'},
    ],
    'other': [
        {'title': 'General feedback', 'description': 'I have some general feedback and suggestions for improvement.'},
        {'title': 'Complaint not listed', 'description': 'My complaint does not fit into any of the listed categories.'},
        {'title': 'Unspecified issue', 'description': 'I encountered an issue that I cannot specify in detail.'},
        {'title': 'Request for assistance', 'description': 'I need assistance with a problem but am not sure how to categorize it.'},
        {'title': 'Query about services', 'description': 'I have a query about the services provided by the company.'},
        {'title': 'Technical support needed', 'description': 'I require technical support for a problem I am facing.'},
        {'title': 'Account-related issue', 'description': 'I have an issue related to my account or user profile.'},
        {'title': 'Feedback on products', 'description': 'I have feedback and suggestions regarding the products offered.'},
        {'title': 'Suggestion for improvement', 'description': 'I have a suggestion for improving a specific aspect of the company.'},
    ],
}

# Generate dummy dataset
complaints_data = []
complaint_id = 1
total_complaints = 0
while total_complaints < 500:
    for category, complaints in categories.items():
        if total_complaints >= 500:
            break
        complaint = random.choice(complaints)
        complaint_title = complaint['title']
        complaint_description = complaint['description']
        rating = random.randint(1, 5)
        
        complaints_data.append({
            'complaintID': f'{complaint_id}',
            'complaintTitle': complaint_title,
            'complaintDescription': complaint_description,
            'complaintCategory': category,
            'Rating': rating
        })
        complaint_id += 1
        total_complaints += 1

# Create DataFrame from the generated data
df = pd.DataFrame(complaints_data)

# Save DataFrame to CSV
df.to_csv('dummy_complaints_data.csv', index=False)