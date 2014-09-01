using System;

namespace Web.Storage.Manager
{
    [AttributeUsage(AttributeTargets.Class)]
    public class BlobStorageAttribute : Attribute
    {
        public BlobStorageAttribute(string containerName)
        {
            ContainerName = containerName;
        }

        public string ContainerName { get; private set; }
    }
}