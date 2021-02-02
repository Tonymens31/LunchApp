$(document).ready(function () {
    $('#myTable').DataTable();


    let btnState = 0;
    let sub = {
        1: { color: 'success', state: 'Active' },
        2: { color: 'danger', state: 'Inactive' }
    };

    let foodData = [
        {
            id: 1,
            food: "Jollof Rice",
            type: "Side Dish",
            vendor: ["Champion Dishes", "Sweet Dishes", "Lovely Foods"],
            status: 1
        },
        {
            id: 2,
            food: "Groundnut Soup with Dry Fish",
            type: "Main Dish",
            vendor: ["Tonymens International Dishes"],
            status: 1
        },
        {
            id: 3,
            food: "Palava Sauce with Chicken",
            type: "Main Dish",
            vendor: ["Michael Nartey's Typical Local Chopbar"],
            status: 2
        },
    ]


    function LoadFood(data) {
        let view = ``;

        //data = [...new Map(foodData.map(ele => [ele.id, ele])).values()];

        data.map(ele => {
            let vendors = ele.vendor

            view += `
                    <tr  id="${ele.id}">
                    <td>${ele.food}<td>  
                    <td>${ele.type}<td>  
                    <td><select>
                        ${vendors.map(x => (`<option>${x}</option>`))}
                        </select>
                    </td>
                    <td>
                        <span class="badge badge-dot mr-4" style="background-color:transparent;padding: 0px;">
                            <i class="bg-${ele.status == 1 ? `success` : `warning`}"></i> <span class="btn btn-${sub[ele.status].color} btn-sm" disabled>${sub[ele.status].state}</span>
                        </span>
                     </td>
                    <td class="">
                        <a href="#" class="text-inverse editButton" id="${ele.id}"  title="Edit"><i class="fas fa-edit"></i></a>
                        <a href="#" class="text-danger deleteButton" title="Delete"><i class="fas fa-trash"></i></a>
                     </td>
                </tr>
                `
        })
        $("#foodTable").html(view)
    }
});