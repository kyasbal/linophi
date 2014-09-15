using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.Models;

namespace Web.ViewModel.Admin
{
    public class UserListViewModel
    {
        public UserListViewModel(IQueryable<UserAccount> accounts)
        {
            Accounts = accounts;
        }

        public IQueryable<UserAccount> Accounts { get; set; }
    }
}