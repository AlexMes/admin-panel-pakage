<?php

namespace alexmes\adminpanel\Http\Controllers;

use Illuminate\Http\Request;

class AdminPanelController extends Controller
{
    public function __invoke(Request $request)
    {
        return view('adminpanel::index');
    }

    public function codegen(){
        return $this->getCode();
    }

    /**
     * @return void
     * Get code from server
     */
    public function getCode(){
        // The URL you are posting to
        $url = 'https://admin-panel.local/api/dbd/v1/code';

// The data you want to POST (e.g., an associative array)
        $post_data = array(
            'field1' => 'value1',
            'field2' => 'value2'
        );

// Convert data to JSON format if the API expects JSON
        $json_post_data = json_encode($post_data);

// Initialize cURL session
        $ch = curl_init();

// Set cURL options
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1); // Set request method to POST
// Set the POST data
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_post_data);
// Return the transfer as a string instead of outputting it directly
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Do NOT include response headers in the returned string
        curl_setopt($ch, CURLOPT_HEADER, false);

// Set custom HTTP headers, including the Accept header
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json', // Inform the server that you are sending JSON
            'Accept: application/json',        // Inform the server that you accept JSON responses
            'authorization: '.$_SERVER['REDIRECT_HTTP_AUTHORIZATION']        //"Bearer 10|Yoe7LKcxOjOtyQQ4JGPw9yFjMW0rD8ZgqGB7Tah486dda032",
        ));

// Execute the cURL request
        $response_body = curl_exec($ch);

// Check for errors
        if (curl_errno($ch)) {
            echo 'cURL error: ' . curl_error($ch);
        }

// Get the HTTP status code
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Close the cURL session
        curl_close($ch);

// Process the response
        if ($httpcode == 200) {
            $decoded_response = json_decode($response_body, true);
            // Use the data as needed
            print_r($decoded_response);
        } else {
            echo "HTTP Error Code: $httpcode";
            echo "Response Body: $response_body";
        }
    }

}
