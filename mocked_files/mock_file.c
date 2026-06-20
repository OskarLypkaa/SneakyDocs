/*
 * mock_file.c
 * 
 * A comprehensive C source file demonstrating various comment styles
 * and test cases for C language features.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* ============================================================
   Function Prototypes
   ============================================================ */

int add(int a, int b);           /* Basic addition function */
int subtract(int a, int b);      /* Basic subtraction function */
void print_array(int arr[], int size); /* Print array elements */
char* concatenate(char* str1, char* str2); /* String concatenation */


/* ============================================================
   Test Case 1: Basic Arithmetic Operations
   ============================================================ */

/*
 * add()
 * Purpose: Add two integers
 * Parameters: int a, int b
 * Returns: Sum of a and b
 */
int add(int a, int b)
{
    // Return the sum (C99 comment style)
    return a + b;
}

/* Subtract two integers */
int subtract(int a, int b)
{
    return a - b; /* Inline comment */
}


/* ============================================================
   Test Case 2: Array Operations
   ============================================================ */

/*
 * print_array()
 * 
 * Prints all elements in an array.
 * 
 * @param arr - pointer to integer array
 * @param size - number of elements in array
 * @return - void
 */
void print_array(int arr[], int size)
{
    /* Loop through each element */
    for (int i = 0; i < size; i++)
    {
        printf("arr[%d] = %d\n", i, arr[i]); /* Print current element */
    }
}


/* ============================================================
   Test Case 3: String Operations
   ============================================================ */

/*
 * concatenate()
 * Combines two strings into a new allocated string.
 * Caller must free the returned pointer.
 */
char* concatenate(char* str1, char* str2)
{
    /* Calculate required length: strlen(s1) + strlen(s2) + 1 (null terminator) */
    int len1 = strlen(str1);
    int len2 = strlen(str2);
    
    /* Allocate memory for the new string */
    char* result = (char*)malloc(len1 + len2 + 1);
    
    if (result == NULL)
    {
        /* Memory allocation failed */
        return NULL;
    }
    
    /* Copy first string */
    strcpy(result, str1);
    
    /* Append second string */
    strcat(result, str2);
    
    return result; /* Return pointer to concatenated string */
}


/* ============================================================
   Test Case 4: Conditional Logic
   ============================================================ */

/*
 * is_even()
 * Determines if a number is even or odd.
 * Returns 1 if even, 0 if odd.
 */
int is_even(int num)
{
    /* Check if remainder of division by 2 is zero */
    if (num % 2 == 0)
    {
        return 1; /* Number is even */
    }
    else
    {
        return 0; /* Number is odd */
    }
}


/* ============================================================
   Test Case 5: Loop Structures
   ============================================================ */

/*
 * factorial()
 * Calculates the factorial of n (n!).
 * 
 * Example: factorial(5) = 5 * 4 * 3 * 2 * 1 = 120
 */
int factorial(int n)
{
    int result = 1;
    
    /* Loop from 1 to n and multiply */
    for (int i = 1; i <= n; i++)
    {
        result *= i; /* Multiply result by current iteration value */
    }
    
    return result; /* Return calculated factorial */
}


/* ============================================================
   Test Case 6: Struct Definition
   ============================================================ */

/*
 * Person structure
 * Contains basic information about a person
 */
struct Person
{
    char name[50];   /* Person's full name */
    int age;         /* Person's age in years */
    float height;    /* Person's height in meters */
    char email[100]; /* Person's email address */
};

/*
 * print_person()
 * Displays all information about a person.
 */
void print_person(struct Person p)
{
    /* Print each field on a separate line */
    printf("Name: %s\n", p.name);
    printf("Age: %d\n", p.age);
    printf("Height: %.2f m\n", p.height);
    printf("Email: %s\n", p.email);
}


/* ============================================================
   Test Case 7: Error Handling
   ============================================================ */

/*
 * safe_divide()
 * Performs division with protection against division by zero.
 * Returns 0 if divisor is zero (error condition).
 */
float safe_divide(float numerator, float denominator)
{
    /* Protect against division by zero */
    if (denominator == 0.0f)
    {
        printf("Error: Division by zero attempted!\n");
        return 0.0f; /* Return 0 as error indicator */
    }
    
    /* Perform the division */
    return numerator / denominator;
}


/* ============================================================
   Main Test Runner
   ============================================================ */

/*
 * main()
 * Entry point for the program.
 * Executes all test cases.
 */
int main(void)
{
    /* Test Case 1: Arithmetic Operations */
    printf("=== Test Case 1: Arithmetic ===\n");
    printf("5 + 3 = %d\n", add(5, 3));
    printf("10 - 4 = %d\n", subtract(10, 4));
    
    /* Test Case 2: Array Operations */
    printf("\n=== Test Case 2: Array Operations ===\n");
    int numbers[] = {10, 20, 30, 40, 50}; /* Initialize test array */
    print_array(numbers, 5);
    
    /* Test Case 3: String Operations */
    printf("\n=== Test Case 3: String Operations ===\n");
    char* combined = concatenate("Hello, ", "World!"); /* Concatenate two strings */
    printf("Result: %s\n", combined);
    free(combined); /* Free allocated memory */
    
    /* Test Case 4: Even/Odd Check */
    printf("\n=== Test Case 4: Even/Odd Check ===\n");
    printf("Is 7 even? %s\n", is_even(7) ? "Yes" : "No");   /* 7 is odd */
    printf("Is 8 even? %s\n", is_even(8) ? "Yes" : "No");   /* 8 is even */
    
    /* Test Case 5: Factorial */
    printf("\n=== Test Case 5: Factorial ===\n");
    printf("Factorial of 5: %d\n", factorial(5)); /* Calculate 5! = 120 */
    
    /* Test Case 6: Struct Usage */
    printf("\n=== Test Case 6: Struct Information ===\n");
    struct Person person = {"Alice Johnson", 28, 1.75, "alice@example.com"};
    print_person(person);
    
    /* Test Case 7: Safe Division */
    printf("\n=== Test Case 7: Safe Division ===\n");
    printf("20 / 4 = %.2f\n", safe_divide(20.0f, 4.0f));     /* Normal division */
    printf("10 / 0 = %.2f\n", safe_divide(10.0f, 0.0f));     /* Division by zero (protected) */
    
    return 0; /* Program completed successfully */
}

/* End of mock_file.c */
