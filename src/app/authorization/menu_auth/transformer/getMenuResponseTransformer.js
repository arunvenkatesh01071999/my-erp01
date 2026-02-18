function transformMenuData(inputData) {
    const transformedData = [];

    // Grouping the data by menu_id
    const groupedData = inputData.reduce((acc, item) => {
        const key = item.menu_id;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});
    console.log("groupedData", groupedData)
    // Creating the final structure and sorting by menu_order
    Object.keys(groupedData)
        .sort((a, b) => {
            const menuA = groupedData[a][0].menu_order;
            const menuB = groupedData[b][0].menu_order;
            return menuA - menuB;
        })
        .forEach(menuId => {
            const menuItems = groupedData[menuId];
            const menuName = menuItems[0].menu_name; // ✅ Corrected access

            const submenus = menuItems
                .map(submenu => {
                    const permissions = [];
                    if (submenu.view) permissions.push("view");
                    if (submenu.save) permissions.push("save");
                    if (submenu.edit) permissions.push("edit");
                    if (submenu.delete) permissions.push("delete");

                    // ✅ Filter out submenu if it has no permissions, except for "Dashboard"
                    if (permissions.length === 0 && menuName !== "Dashboard") {
                        return null;
                    }

                    return {
                        submenu_id: submenu.submenu_id,
                        text: submenu.sub_menu_name,
                        path: submenu.sub_menu_url,
                        permission: permissions
                    };
                })
                .filter(submenu => submenu !== null) // ✅ Remove null entries
                .sort((a, b) => a.sub_menu_order - b.sub_menu_order); // ✅ Sorting by submenu order
            console.log("permissions", submenus)

            const menuObj = {
                menu_id: Number(menuId),
                text: menuName,
                icon: menuItems[0].menu_icon,
                path: menuItems[0].menu_url
            };

            // Add submenus ONLY if menu_id ≠ 37
            if (Number(menuId) !== 37) {
                menuObj.submenus = submenus.length > 0 ? submenus : [];
            }


            // ✅ Ensure "Dashboard" is included even if it has no submenus
            transformedData.push(menuObj);
        });

    return transformedData;
}


function rolePermissionTransformMenuData(inputData) {
    const transformedData = [];

    // Grouping the data by menu_id
    const groupedData = inputData.reduce((acc, item) => {
        const key = item.menu_id;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});

    // Creating the final structure and sorting by menu_order
    Object.keys(groupedData)
        .sort((a, b) => {
            // Sort menu groups by menu_order
            const menuA = groupedData[a][0].menu_order;
            const menuB = groupedData[b][0].menu_order;
            return menuA - menuB;
        })
        .forEach(menuId => {
            const menuItems = groupedData[menuId];

            // Skip if the menu is "Dashboard"
            if (menuItems[0].menu_name.toLowerCase() === "dashboard") {
                return;
            }

            const submenus = menuItems
                .filter(submenu => submenu.submenu_id !== null) // ✅ Filter out null submenu_id
                .map(submenu => ({
                    submenu_id: submenu.submenu_id,
                    sub_menu_name: submenu.sub_menu_name,
                    permission: [
                        { view: submenu.permission.view ?? false },
                        { save: submenu.permission.save ?? false },
                        { edit: submenu.permission.edit ?? false },
                        { delete: submenu.permission.delete ?? false }
                    ]
                }))
                .sort((a, b) => a.sub_menu_order - b.sub_menu_order); // ✅ Sorting by submenu order

            const menu = {
                menu_id: Number(menuId),
                menu_name: menuItems[0].menu_name,
                view: false,
                save: false,
                edit: false,
                delete: false,
                submenus // ✅ Empty array if no submenu exists
            };

            transformedData.push(menu);
        });

    return transformedData;
}


module.exports = {
    transformMenuData,
    rolePermissionTransformMenuData
}