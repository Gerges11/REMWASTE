package tests;

import org.testng.Assert;
import org.testng.annotations.Test;
import pages.ItemPage;
import pages.LoginPage;
import base.BaseTest;

public class LoginTests extends BaseTest {

    @Test(priority = 1)
    public void testValidLogin() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("admin", "admin"); // Use "admin"/"admin" as per your backend

        // Assert: Check if redirected to dashboard/home by verifying presence of item management elements
        // Assuming the ItemPage elements (like the Add Item button) are visible after successful login
        ItemPage itemPage = new ItemPage(driver);
        Assert.assertTrue(itemPage.isElementVisible(itemPage.getAddItemButtonLocator()), "Login failed for valid credentials: Add Item button not visible.");
    }

    @Test(priority = 2)
    public void testInvalidLogin() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("admin", "wrongpass");

        String error = loginPage.getErrorMessage();
        Assert.assertEquals(error, "Invalid credentials", "Error message mismatch or not shown for invalid login"); // Updated expected message
    }

    @Test(priority = 3)
    public void testLoginValidation() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("", ""); // Attempt to login with empty fields

        String error = loginPage.getErrorMessage();
        Assert.assertEquals(error, "Invalid credentials", "Error message mismatch or not shown for invalid login");
    }
}
