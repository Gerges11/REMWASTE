package tests;

import org.testng.Assert;
import org.testng.annotations.Test;
import pages.ItemPage;
import pages.LoginPage;
import base.BaseTest;

public class ItemTests extends BaseTest {

    // Helper method to login before tests that require it
    private void loginFirst() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("admin", "admin"); // Uses 'admin'/'admin'
        // Ensure we are on the item page after login
        ItemPage itemPage = new ItemPage(driver);
        Assert.assertTrue(itemPage.isElementVisible(itemPage.getAddItemButtonLocator()), "Failed to navigate to item page after login.");
    }

    @Test(priority = 1)
    public void testCreateNewItem()  {
        loginFirst();
        ItemPage itemPage = new ItemPage(driver);
        String itemName = "Test Item " + System.currentTimeMillis(); // Use unique name
        itemPage.createItem(itemName);
        // Assert that the item is visible in the list on the UI
        Assert.assertTrue(itemPage.getItemListText().contains(itemName), "Item '" + itemName + "' not created or not found in list.");
    }

    @Test(priority = 2)
    public void testCreateItemWithEmptyName()  {
        loginFirst();
        ItemPage itemPage = new ItemPage(driver);
        itemPage.createItem(""); // Attempt to create with empty name

        // Expect frontend to display a validation message
        String error = itemPage.getErrorMessage();
        Assert.assertFalse(error.isEmpty(), "Error message was not displayed for empty name.");
        Assert.assertEquals(error, "Item name is required.", "Error message for empty name did not match expected text.");
    }



    @Test(priority = 3)
    public void testEditItem()  {
        loginFirst();
        ItemPage itemPage = new ItemPage(driver);
        String originalItemName = "ItemToEdit" + System.currentTimeMillis();
        itemPage.createItem(originalItemName); // Create an item to edit

        String updatedItemName = "Updated Item " + System.currentTimeMillis();
        itemPage.editItemByName(originalItemName, updatedItemName); // Use the new method

        Assert.assertTrue(itemPage.getItemListText().contains(updatedItemName), "Item name not updated to '" + updatedItemName + "'.");
        Assert.assertFalse(itemPage.getItemListText().contains(originalItemName), "Original item name '" + originalItemName + "' still found after update.");
    }


    @Test(priority = 4)
    public void testDeleteItem()  {
        loginFirst();
        ItemPage itemPage = new ItemPage(driver);
        String itemToDelete = "ItemToDelete" + System.currentTimeMillis();
        itemPage.createItem(itemToDelete); // Create a unique item for this test

        itemPage.deleteFirstItem(); // Delete the first item


    }


    @Test(priority = 5)
    public void testViewItemsWithoutLogin() {
        // This test does NOT call loginFirst() to ensure it's an unauthenticated attempt.
        driver.get("http://localhost:3000/"); // Start from the root URL (adjust if your app runs on 3000)

        // The React App.js redirects to Login if not logged in by changing currentPage state.
        // Assert that the login page elements are visible
        LoginPage loginPage = new LoginPage(driver);
        Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Unauthorized access to dashboard was not redirected to login page.");
    }

    @Test(priority = 6)
    public void testLogoutFunctionality() {
        loginFirst(); // Login first
        ItemPage itemPage = new ItemPage(driver);
        itemPage.logout(); // Perform logout action

        // Assert that after logout, the login page elements are visible
        LoginPage loginPage = new LoginPage(driver);
        Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Logout failed or did not redirect to login page.");

        // Optionally, try to access a protected page after logout to confirm re-login is required
        // (This would require navigating to a specific URL if you had real routing,
        // but with state-based routing, you'd just check the UI elements again)
        driver.get("http://localhost:3000/"); // Go back to base URL
        Assert.assertTrue(loginPage.isLoginPageDisplayed(), "After logout, protected page accessible without re-login.");
    }
}